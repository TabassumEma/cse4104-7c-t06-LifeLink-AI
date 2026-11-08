import { currentDonor, donationHistory } from "../data/mockData";

const PROFILE_KEY = "lifelink_donor_profile";
const HISTORY_KEY = "lifelink_donor_history";

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

export function getProfile() {
  return read(PROFILE_KEY, currentDonor);
}

export function updateProfile(changes) {
  const updated = { ...getProfile(), ...changes };
  write(PROFILE_KEY, updated);
  return updated;
}

export function getHistory() {
  return read(HISTORY_KEY, donationHistory);
}

function sortNewestFirst(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

// PDF 4.4: the waiting period is always counted from the newest donation
function syncLastDonation(history) {
  const latest = history.length > 0 ? history[0].date : null;
  updateProfile({ lastDonation: latest });
}

export function addDonation({ date, hospital }) {
  const profile = getProfile();
  const entry = { id: Date.now(), date, hospital, bloodGroup: profile.bloodGroup };
  const history = sortNewestFirst([entry, ...getHistory()]);
  write(HISTORY_KEY, history);
  syncLastDonation(history);
  return history;
}

export function updateDonation(id, { date, hospital }) {
  const history = sortNewestFirst(
    getHistory().map((h) => (h.id === id ? { ...h, date, hospital } : h))
  );
  write(HISTORY_KEY, history);
  syncLastDonation(history);
  return history;
}

export function deleteDonation(id) {
  const history = getHistory().filter((h) => h.id !== id);
  write(HISTORY_KEY, history);
  syncLastDonation(history);
  return history;
}