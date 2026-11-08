// Seconds/millis the device clock is off compared with the server clock
let offset = 0;

// "now" corrected with the server time (falls back to device time)
export function now() {
  return new Date(Date.now() + offset);
}

// Ask the server for the real time once. Works for the deployed site;
// on localhost the server is this laptop, so nothing changes there.
export async function syncClock() {
  try {
    const res = await fetch(window.location.origin, { method: "HEAD", cache: "no-store" });
    const serverDate = res.headers.get("Date");
    if (serverDate) {
      const serverTime = new Date(serverDate).getTime();
      if (!Number.isNaN(serverTime)) offset = serverTime - Date.now();
    }
  } catch (e) {
    console.warn("Could not sync clock, using device time", e);
  }
}

// today's date in Bangladesh as "YYYY-MM-DD", whatever the laptop time zone is
export function dhakaDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now());
}