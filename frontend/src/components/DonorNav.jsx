import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/donor/dashboard", label: "Dashboard" },
  { to: "/donor/profile", label: "My Profile" },
  { to: "/donor/history", label: "Donation History" },
  { to: "/donor/requests", label: "Requests" },
];

export default function DonorNav() {
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
                  ? "border-red-600 text-red-700"
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