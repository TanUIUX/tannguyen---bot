import type { DayItem } from "./types";

export function generateDays(
  center = new Date(),
  daysBefore = 30,
  daysAfter = 30,
): DayItem[] {
  const result: DayItem[] = [];
  const start = new Date(center);
  start.setDate(start.getDate() - daysBefore);

  for (let i = 0; i <= daysBefore + daysAfter; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    result.push({
      id: d.toISOString().split("T")[0],
      name: d.toLocaleDateString("en-US", { weekday: "long" }),
      date: d.toLocaleDateString("en-US", { day: "2-digit", month: "long" }),
      fullDate: d,
    });
  }

  return result;
}
