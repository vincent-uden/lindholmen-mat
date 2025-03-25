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
