import { useState, useEffect } from "react";
import { now } from "./clock";
import { isInCooldown, nextEligibleDate, formatDate } from "./cooldown";

const KEY = "lifelink_notifications";
const SEEN_KEY = "lifelink_notification_ids";
const EVENT = "lifelink-notifications-changed";

// types: "new_request", "cooldown", "status", "no_longer_needed"
const seed = [
  {
    id: "seed-1",
    type: "new_request",
    title: "New request: A+ blood needed",
    message: "Karim Mia needs 2 units of A+ at Khulna Medical College Hospital (Critical).",
    link: "/donor/requests",
    read: false,
    createdAt: "2026-11-09T09:05:00.000Z",
  },
  {
    id: "seed-2",
    type: "status",
    title: "Request LL-1002 updated",
    message: "One donor has committed to request LL-1002. One more donor is still needed.",
    link: "/donor/requests",
    read: false,
    createdAt: "2026-11-08T14:20:00.000Z",
  },
  {
    id: "seed-3",
    type: "no_longer_needed",
    title: "Request LL-1003: no longer needed",
    message: "Enough donors have committed to request LL-1003. Thank you for being ready to help.",
    link: null,
    read: true,
    createdAt: "2026-11-05T16:00:00.000Z",
  },
];

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error("Storage read failed", e);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage write failed", e);
  }
}

function save(list) {
  write(KEY, list);
  // tell every component that shows notifications to refresh
  window.dispatchEvent(new Event(EVENT));
}

export function getNotifications() {
  return [...read(KEY, seed)].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// If an id is given, the same notification is never created twice,
// even after the donor deleted it.
export function addNotification({ id, type, title, message, link = null }) {
  if (id) {
    const seen = read(SEEN_KEY, []);
    if (seen.includes(id)) return;
    write(SEEN_KEY, [...seen, id]);
  }
  const newId = id || `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const item = {
    id: newId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: now().toISOString(),
  };
  save([item, ...read(KEY, seed)]);
}

export function markRead(id) {
  save(read(KEY, seed).map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead() {
  save(read(KEY, seed).map((n) => ({ ...n, read: true })));
}

export function removeNotification(id) {
  save(read(KEY, seed).filter((n) => n.id !== id));
}

export function clearAll() {
  save([]);
}

// PDF 4.4: cooldown reminders, created from the donor's last donation date
export function syncCooldownNotifications(profile) {
  if (!profile.lastDonation) return;
  const next = nextEligibleDate(profile.lastDonation, profile.gender);

  if (isInCooldown(profile.lastDonation, profile.gender)) {
    addNotification({
      id: `cooldown-start-${profile.lastDonation}`,
      type: "cooldown",
      title: "Waiting period started",
      message: `Thank you for donating on ${formatDate(profile.lastDonation)}. You can donate again from ${formatDate(next)}.`,
      link: "/donor/history",
    });
  } else {
    addNotification({
      id: `cooldown-end-${profile.lastDonation}`,
      type: "cooldown",
      title: "You can donate again",
      message: "Your waiting period has ended. You are eligible to donate again.",
      link: "/donor/requests",
    });
  }
}

// React hook: always returns the latest notifications
export function useNotifications() {
  const [items, setItems] = useState(getNotifications());

  useEffect(() => {
    const update = () => setItems(getNotifications());
    window.addEventListener(EVENT, update);
    update();
    return () => window.removeEventListener(EVENT, update);
  }, []);

  return items;
}