export function isValidISOSDate(dateStr: string): boolean {
  if (typeof dateStr !== "string") return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString() === dateStr;
}

export function isValidRecurrence(
  recurrence: any
): recurrence is "daily" | "weekly" | "monthly" {
  return (
    typeof recurrence === "string" &&
    ["daily", "weekly", "monthly"].includes(recurrence)
  );
}
