import { hashPassword } from "./hash";

const KEY = "lifelink_admins";

// Demo admin: admin@lifelink.com / admin1234 (the password is stored only as a hash)
const seed = [
  {
    id: 1,
    name: "Admin",
    email: "admin@lifelink.com",
    passwordHash: "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270",
    createdBy: "System",
    createdAt: "2026-11-01T00:00:00.000Z",
  },
];

export function getAdmins() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : seed;
  } catch (e) {
    console.error("Storage read failed", e);
    return seed;
  }
}

export function addAdmin({ name, email, passwordHash, createdBy }) {
  const list = getAdmins();
  if (list.some((a) => a.email === email)) {
    return { ok: false, error: "An admin with this email already exists." };
  }
  const admin = {
    id: Date.now(),
    name,
    email,
    passwordHash,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([...list, admin]));
  } catch (e) {
    console.error("Storage write failed", e);
    return { ok: false, error: "Could not save the admin account." };
  }
  return { ok: true };
}

// returns the admin if email and password match, otherwise null
export async function verifyAdmin(email, password) {
  const hash = await hashPassword(password);
  const wanted = email.trim().toLowerCase();
  return getAdmins().find((a) => a.email === wanted && a.passwordHash === hash) || null;
}