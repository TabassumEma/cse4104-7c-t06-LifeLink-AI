import { allDonors as seed } from "../data/adminData";

const KEY = "lifelink_donors";

export function getDonors() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : seed;
  } catch (e) {
    console.error("Storage read failed", e);
    return seed;
  }
}

// status: "Verified", "Pending" or "Blocked"
export function setDonorStatus(id, status) {
  const list = getDonors().map((d) => (d.id === id ? { ...d, status } : d));
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Storage write failed", e);
  }
  return list;
}