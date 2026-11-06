import { allRequests as seed } from "../data/adminData";

const KEY = "lifelink_admin_requests";

export function getAdminRequests() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : seed;
  } catch (e) {
    console.error("Storage read failed", e);
    return seed;
  }
}

function save(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Storage write failed", e);
  }
  return list;
}

export function closeRequest(code) {
  return save(
    getAdminRequests().map((r) => (r.code === code ? { ...r, status: "Closed" } : r))
  );
}

export function removeRequest(code) {
  return save(getAdminRequests().filter((r) => r.code !== code));
}