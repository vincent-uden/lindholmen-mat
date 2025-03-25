import type { Meal, MenuDay } from "./types";
import jsdom from "jsdom";

/**
 * Given a date, return a new Date set to the Monday of that week.
 */
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
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
  const monday = getMonday(startDate);

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
 * Given an HTML string representing one item’s description,
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
