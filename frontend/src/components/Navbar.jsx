import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/request", label: "Request Blood" },
  { to: "/track", label: "Track Request" },
  { to: "/donor/login", label: "Donor Login" },
  { to: "/admin/login", label: "Admin" },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-red-600">
          🩸 LifeLink AI
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                isActive ? "text-red-600" : "text-gray-600 hover:text-red-600"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}