import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getProfile } from "../utils/donorProfileStore";
import { useNotifications, syncCooldownNotifications } from "../utils/notificationStore";

const tabs = [
  { to: "/donor/dashboard", label: "Dashboard" },
  { to: "/donor/profile", label: "My Profile" },
  { to: "/donor/history", label: "Donation History" },
  { to: "/donor/requests", label: "Requests" },
  { to: "/donor/notifications", label: "Notifications" },
];

export default function DonorNav() {
  const unread = useNotifications().filter((n) => !n.read).length;

  // create cooldown reminders from the donor's last donation
  useEffect(() => {
    syncCooldownNotifications(getProfile());
  }, []);

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
            {t.to === "/donor/notifications" && unread > 0 && (
              <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}