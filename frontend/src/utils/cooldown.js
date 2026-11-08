import { now, dhakaDateString } from "./clock";

// Dates in the app are plain "YYYY-MM-DD" strings (what <input type="date"> gives).
// They are read as LOCAL dates so the day never shifts with the computer's time zone.
export function parseDate(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

// today's date as "YYYY-MM-DD" (Bangladesh date, corrected with server time)
export function todayString() {
  return dhakaDateString();
}

// PDF 4.4: 3 months for male donors, 4 months for female donors
export function nextEligibleDate(lastDonation, gender) {
  const d = parseDate(lastDonation);
  d.setMonth(d.getMonth() + (gender === "female" ? 4 : 3));
  return d;
}

export function isInCooldown(lastDonation, gender) {
  return now() < nextEligibleDate(lastDonation, gender);
}

export function formatDate(date) {
  return parseDate(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysRemaining(lastDonation, gender) {
  const ms = nextEligibleDate(lastDonation, gender) - now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}