import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../utils/notificationStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/request", label: "Request Blood" },
  { to: "/track", label: "Track Request" },
  { to: "/donor/login", label: "Donor Login" },
  { to: "/donor/register", label: "Become a Donor" },
  { to: "/admin/login", label: "Admin" },
];

export default function Navbar() {
  const { user } = useAuth();
  const unread = useNotifications().filter((n) => !n.read).length;
  const isDonor = user?.role === "donor";

  const linkClass = ({ isActive }) =>
    isActive ? "text-red-600" : "text-gray-600 hover:text-red-600";

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-red-600">
          LifeLink AI
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {isDonor && (
            <NavLink to="/donor/notifications" className={linkClass}>
              Notifications
              {unread > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  {unread}
                </span>
              )}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}