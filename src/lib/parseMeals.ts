import type { Meal, MenuDay } from "./types";
import jsdom from "jsdom";

/**
 * Returns the Unix timestamp (in milliseconds) for 00:01 on Monday (the start
 * of the week) in the given time zone, relative to the week of the provided date.
 *
 * @param {Date} date - The input date.
 * @param {string} timeZone - An IANA time zone name (e.g., "America/New_York").
 * @returns {number} - Timestamp in milliseconds.
 */
function getMonday(date: Date, timeZone: string) {
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timeZone }),
  );
  let weekday = localDate.getDay();
  weekday = weekday === 0 ? 7 : weekday;
  localDate.setDate(localDate.getDate() - (weekday - 1));
  localDate.setHours(0, 1, 0, 0);
  return localDate;
}

/**
 * Returns an array of MenuDay objects parsed from the HTML string.
 * The weekday sections are identified by ids "monday", "tuesday", ..., "friday".
 * The date for each day is computed for the current week.
 */
export function parseKooperativetMenuDays(
  html: string,
  startDate: Date | null,
): MenuDay[] {
  if (startDate == null) {
    startDate = new Date();
  }
  const monday = getMonday(startDate, "Europe/Stockholm");

  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const weekdayDates: { [key: string]: Date } = {};
  weekdays.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    weekdayDates[day] = date;
  });

  const dom = new jsdom.JSDOM();
  const parser = new dom.window.DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const menuDays: MenuDay[] = [];
  weekdays.forEach((dayId) => {
    const container = doc.querySelector(`#${dayId}`);
    if (!container) return;

    const meals: Meal[] = [];
    const contentWrapper = container.querySelector(".entry-content-wrapper");
    if (!contentWrapper) return;

    const paragraphs = Array.from(contentWrapper.querySelectorAll("p"));
    let currentCategory = "";

    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || "";
      const strongEl = p.querySelector("strong");
      if (strongEl) {
        currentCategory = strongEl.textContent?.trim() ?? "";
        const remainder = text.replace(currentCategory, "").trim();
        if (remainder) {
          meals.push({
            category: currentCategory,
            name: remainder,
          });
        }
      } else if (currentCategory && text) {
        meals.push({
          category: currentCategory,
          name: text,
        });
      }
    });

    menuDays.push({
      date: weekdayDates[dayId]!,
      meals,
    });
  });

  return menuDays;
}

/**
 * Converts a date string in "DD-MM-YYYY" format to a Date object.
 */
function parseDateString(dateStr: string): Date {
  // e.g. "24-03-2025"
  const [day, month, year] = dateStr.split("-").map(Number);
  // Create a date (months are 0-indexed in JS)
  return new Date(year!, month! - 1, day);
}

/**
 * Given an HTML string representing one item's description,
 * extract an array of Meal objects.
 *
 * The HTML is assumed to contain one or more <p> elements.
 * In each <p> a <strong> tag denotes a new meal category.
 */
function extractMealsFromDescription(descriptionHtml: string): Meal[] {
  // Create a document to parse the description.
  const dom = new jsdom.JSDOM();
  const parser = new dom.window.DOMParser();
  // Note: the description is often encoded as HTML in a text node, so we parse it as text/html.
  const doc = parser.parseFromString(descriptionHtml, "text/html");
  const meals: Meal[] = [];
  let currentCategory = "";

  // Get all <p> elements
  const paragraphs = Array.from(doc.querySelectorAll("p"));

  paragraphs.forEach((p) => {
    // Take the text content for processing.
    const text = p.textContent?.trim() || "";
    const strongEl = p.querySelector("strong");
    if (strongEl) {
      currentCategory = strongEl.textContent?.replace(":", "").trim() || "";
      // Remove the strong text from the paragraph to get the meal details.
      const remainder = text.replace(strongEl.textContent || "", "").trim();
      if (remainder.length > 0) {
        meals.push({
          category: currentCategory,
          name: remainder,
        });
      }
    } else if (currentCategory && text.length > 0) {
      meals.push({
        category: currentCategory,
        name: text,
      });
    }
  });

  return meals;
}

/**
 * Parses the provided XML (RSS) string from WorldOfFood and extracts an array of MenuDay objects.
 *
 * The XML is expected to have <item> elements where:
 *   - The <title> is in the form "Weekday, DD-MM-YYYY" (e.g. "Måndag, 24-03-2025").
 *   - The <description> contains HTML with one or more paragraphs with meal details.
 */
export function parseWorldOfFoodRSS(xml: string): MenuDay[] {
  const dom = new jsdom.JSDOM();
  const parser = new dom.window.DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const items = Array.from(doc.getElementsByTagName("item"));
  const menuDays: MenuDay[] = [];

  items.forEach((item) => {
    const titleEl = item.getElementsByTagName("title")[0];
    if (!titleEl) return;
    const titleText = titleEl.textContent || "";
    const parts = titleText.split(",");
    if (parts.length < 2) return;
    const dateString = parts[1]!.trim();
    const date = parseDateString(dateString);

    const descriptionEl = item.getElementsByTagName("description")[0];
    const descriptionHtml = descriptionEl?.textContent || "";
    const meals =
      descriptionHtml.trim().length > 0
        ? extractMealsFromDescription(descriptionHtml)
        : [];

    if (meals.length > 0) {
      menuDays.push({
        date,
        meals,
      });
    }
  });

  return menuDays;
}

export function parseBombayBistroMenuDays(html: string, startDate: Date | null): MenuDay[] {
  if (startDate == null) {
    startDate = new Date();
  }
  const monday = getMonday(startDate, "Europe/Stockholm");

  const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
  const weekdayDates: { [key: string]: Date } = {};
  weekdays.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    weekdayDates[day] = date;
  });

  const dom = new jsdom.JSDOM();
  const parser = new dom.window.DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Determine which week's menu to use based on the current week number
  // This replicates the logic from the website's JavaScript
  const getWeekNumber = (date: Date): number => {
    const onejan = new Date(date.getFullYear(), 0, 4);
    return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  };

  const weekNumber = getWeekNumber(startDate);
  let menuWeekNumber = 1;
  
  // Calculate which of the 4 menu weeks to use
  let i = 1;
  let count = 1;
  while (i < 53) {
    if (i === weekNumber) {
      menuWeekNumber = count;
      break;
    }
    if (i && (i % 4 === 0)) {
      count = 0;
    }
    i++;
    count++;
  }

  const menuSelector = `.vecka${menuWeekNumber}`;
  const menuContainer = doc.querySelector(menuSelector);
  
  if (!menuContainer) {
    console.warn(`Menu week ${menuWeekNumber} not found in HTML`);
    return [];
  }

  const menuDays: MenuDay[] = [];
  let currentDay = "";
  let currentDayMeals: Meal[] = [];

  const elements = menuContainer.querySelectorAll("h2, p");
  
  const dayHeaders = menuContainer.querySelectorAll("h2");
  
  const dayNameMap: Record<string, string> = {};
  weekdays.forEach(day => {
    // Normalize by removing diacritics and converting to lowercase
    const normalized = day.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    dayNameMap[normalized] = day;
  });
  
  elements.forEach((element) => {
    const text = element.textContent?.trim() || "";
    
    // If it's an h2, it's a new day
    if (element.tagName === "H2") {
      if (currentDay && weekdayDates[currentDay] && currentDayMeals.length > 0) {
        menuDays.push({
          date: weekdayDates[currentDay]!,
          meals: [...currentDayMeals]
        });
      }
      
      currentDay = text;
      currentDayMeals = [];
      
      const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const matchedDay = weekdays.find(day => {
        const normalizedDay = day.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return normalizedText.includes(normalizedDay);
      });
      
      if (matchedDay) {
        currentDay = matchedDay;
      } else {
        currentDay = "";
      }
    } 
    else if (currentDay && element.tagName === "P") {
      const strongEl = element.querySelector("strong");
      const emEl = element.querySelector("em");
      
      if (strongEl && emEl) {
        const name = strongEl.textContent?.trim() || "";
        const description = emEl.textContent?.trim() || "";
        
        // Skip meals that are in the "Andra alternativ" section
        if (!name.includes("KR")) {
          currentDayMeals.push({
            category: name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" "),
            name: description
          });
        }
      }
    }
  });
  
  if (currentDay && weekdayDates[currentDay] && currentDayMeals.length > 0) {
    menuDays.push({
      date: weekdayDates[currentDay]!,
      meals: [...currentDayMeals]
    });
  }

  
  return menuDays;
}

/**
 * Parses the District One menu from HTML.
 * The menu is organized by weekdays (Måndag, Tisdag, etc.) with meal categories
 * like Ramen, Fisk, Kött, etc. under each day.
 */
export function parseDistrictOneMenuDays(
  html: string,
  startDate: Date | null,
): MenuDay[] {
  if (startDate == null) {
    startDate = new Date();
  }
  const monday = getMonday(startDate, "Europe/Stockholm");

  const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
  const weekdayDates: { [key: string]: Date } = {};
  weekdays.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    weekdayDates[day] = date;
  });

  const dom = new jsdom.JSDOM();
  const parser = new dom.window.DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const menuDays: MenuDay[] = [];
  
  // Find all paragraphs in the document
  const paragraphs = Array.from(doc.querySelectorAll("p"));
  
  let currentDay = "";
  let currentCategory = "";
  let currentMeals: Meal[] = [];
  
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (!p) continue;
    
    const text = p.textContent?.trim() || "";
    
    // Skip separator lines that contain only dots or dashes
    if (/^[.\-]+$/.test(text)) continue;
    
    // Stop processing if we encounter footer content
    if (text === "KONTAKTA OSS" || text === "ÖPPETTIDER") {
      break;
    }
    
    // Check if this is a day header
    if (weekdays.includes(text)) {
      // If we were processing a previous day, save it
      if (currentDay && currentMeals.length > 0) {
        menuDays.push({
          date: weekdayDates[currentDay]!,
          meals: [...currentMeals],
        });
        currentMeals = [];
      }
      
      currentDay = text;
      currentCategory = "";
    } 
    // Check if this is a category header (underlined text)
    else if (p.querySelector("span[style*='text-decoration: underline']") || 
             p.querySelector("span[style*='text-decoration-line: underline']")) {
      currentCategory = text;
    } 
    // If we have a current day and category, this is a meal description
    else if (currentDay && currentCategory && text) {
      currentMeals.push({
        category: currentCategory,
        name: text,
      });
    }
  }
  
  // Add the last day if it exists
  if (currentDay && currentMeals.length > 0) {
    menuDays.push({
      date: weekdayDates[currentDay]!,
      meals: [...currentMeals],
    });
  }
  
  return menuDays;
}
