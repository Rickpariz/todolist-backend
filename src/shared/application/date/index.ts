import { isAfter, startOfDay } from "date-fns";

export function isFutureDate(selectedDate: Date) {
  const today = startOfDay(new Date());
  return isAfter(selectedDate, today);
}
