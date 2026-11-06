import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/donors", label: "Manage Donors" },
  { to: "/admin/requests", label: "Manage Requests" },
  { to: "/admin/create", label: "Create Admin" },
];

export default function AdminNav() {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
                isActive
                  ? "border-gray-800 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}