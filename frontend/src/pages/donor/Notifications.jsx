import { useState } from "react";
import { Link } from "react-router-dom";
import DonorNav from "../../components/DonorNav";
import {
  useNotifications,
  addNotification,
  markRead,
  markAllRead,
  removeNotification,
  clearAll,
} from "../../utils/notificationStore";
import { now } from "../../utils/clock";
import { formatDate } from "../../utils/cooldown";

const typeInfo = {
  new_request: { label: "New request", color: "bg-red-100 text-red-700" },
  cooldown: { label: "Reminder", color: "bg-yellow-100 text-yellow-800" },
  status: { label: "Status update", color: "bg-blue-100 text-blue-800" },
  no_longer_needed: { label: "No longer needed", color: "bg-gray-200 text-gray-700" },
};

function timeAgo(iso) {
  const minutes = Math.floor((now() - new Date(iso)) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return formatDate(new Date(iso));
}

export default function Notifications() {
  const items = useNotifications();
  const [filter, setFilter] = useState("all");

  const unread = items.filter((n) => !n.read).length;
  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;

  const handleClear = () => {
    if (window.confirm("Delete all notifications?")) clearAll();
  };

  const filterButton = (value, label) => (
    <button
      onClick={() => setFilter(value)}
      className={`rounded-full px-4 py-1 text-sm font-medium ${
        filter === value
          ? "bg-red-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <DonorNav />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-gray-600">
              {unread > 0 ? `${unread} unread` : "You are all caught up"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="rounded-lg border border-gray-500 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Mark all as read
            </button>
            <button
              onClick={handleClear}
              disabled={items.length === 0}
              className="rounded-lg border border-red-600 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {filterButton("all", `All (${items.length})`)}
          {filterButton("unread", `Unread (${unread})`)}
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 rounded-xl bg-white p-6 text-gray-600 shadow">
            {filter === "unread"
              ? "No unread notifications."
              : "No notifications yet. You will be notified about matching blood requests, reminders and request updates."}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {shown.map((n) => {
              const info = typeInfo[n.type] || typeInfo.status;
              return (
                <div
                  key={n.id}
                  className={`rounded-xl bg-white p-4 shadow ${
                    n.read ? "" : "border-l-4 border-red-600"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${info.color}`}>
                      {info.label}
                    </span>
                    <span className="text-xs text-gray-500">{timeAgo(n.createdAt)}</span>
                  </div>

                  <h2 className={`mt-2 ${n.read ? "font-medium" : "font-bold"}`}>{n.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{n.message}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => markRead(n.id)}
                        className="font-medium text-red-600"
                      >
                        View
                      </Link>
                    )}
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-gray-600 hover:underline">
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-gray-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* prototype tools: shows what the backend will trigger later */}
        <div className="mt-8 rounded-xl border border-dashed border-gray-400 p-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Prototype tools (remove before deployment)
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            In the final system the backend creates these notifications automatically.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() =>
                addNotification({
                  type: "new_request",
                  title: "New request: A+ blood needed",
                  message: "Rina Begum needs 3 units of A+ at Khulna Medical College Hospital (High).",
                  link: "/donor/requests",
                })
              }
              className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200"
            >
              Simulate: new matching request
            </button>
            <button
              onClick={() =>
                addNotification({
                  type: "no_longer_needed",
                  title: "Request LL-1001: no longer needed",
                  message: "Enough donors have committed to request LL-1001. Thank you for responding.",
                })
              }
              className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200"
            >
              Simulate: request fulfilled
            </button>
            <button
              onClick={() =>
                addNotification({
                  type: "status",
                  title: "Request LL-1002 is open again",
                  message: "A committed donor cancelled. Request LL-1002 needs a donor again.",
                  link: "/donor/requests",
                })
              }
              className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium hover:bg-gray-200"
            >
              Simulate: request reopened
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}