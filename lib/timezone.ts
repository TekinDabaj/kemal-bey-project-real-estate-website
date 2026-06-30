// Cyprus observes EET (UTC+2) in winter and EEST (UTC+3) in summer.
// Using the IANA zone name lets the JS runtime resolve the correct DST
// offset for any given date automatically, so we never hardcode +2 or +3.
export const CYPRUS_TIMEZONE = "Asia/Nicosia";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Returns the offset of a timezone, in minutes east of UTC, for a given
 * instant (e.g. +120 for Cyprus winter, +180 for Cyprus summer).
 */
function tzOffsetMinutes(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const map: Record<string, number> = {};
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = Number(part.value);
  }

  // Some environments render midnight as hour 24 instead of 0.
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUTC = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    hour,
    map.minute,
    map.second
  );

  return (asUTC - date.getTime()) / 60000;
}

/**
 * Converts a Cyprus wall-clock date + time (e.g. "2026-07-15", "14:00") into
 * the absolute Date (UTC instant), accounting for EET/EEST DST.
 */
export function cyprusWallClockToInstant(
  dateStr: string,
  timeStr: string
): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);

  // Treat the wall-clock components as if they were UTC, then subtract the
  // zone's offset at that moment to get the real instant.
  const utcGuess = Date.UTC(y, mo - 1, d, h, mi);
  const offset = tzOffsetMinutes(CYPRUS_TIMEZONE, new Date(utcGuess));
  return new Date(utcGuess - offset * 60000);
}

/**
 * Returns today's date as "YYYY-MM-DD" as it currently is in Cyprus.
 */
export function getCyprusToday(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CYPRUS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Builds naive local datetime strings (no offset / "Z") like
 * "2026-07-15T14:00:00" for a start time and start + durationMinutes.
 *
 * These are meant to be sent to the Google Calendar API together with
 * timeZone: CYPRUS_TIMEZONE, so Google applies the correct EET/EEST offset
 * and resolves DST itself. We deliberately do NOT call toISOString() here,
 * because that would anchor the time to the server's UTC clock.
 */
export function buildNaiveDateTimeRange(
  dateStr: string,
  timeStr: string,
  durationMinutes: number
): { startDateTime: string; endDateTime: string } {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);

  // Use a UTC anchor purely for arithmetic (handles hour/day rollover, e.g.
  // a 23:30 slot ending at 00:30 the next day), then read the wall-clock
  // components back out — no real timezone is ever applied.
  const startAnchor = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const endAnchor = new Date(startAnchor.getTime() + durationMinutes * 60000);

  const fmt = (dt: Date) =>
    `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(
      dt.getUTCDate()
    )}T${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:00`;

  return { startDateTime: fmt(startAnchor), endDateTime: fmt(endAnchor) };
}
