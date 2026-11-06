import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import { getAdminRequests, closeRequest, removeRequest } from "../../utils/adminRequestStore";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const statuses = ["All", "Open", "In Progress", "Fulfilled", "Closed"];

const statusColor = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Fulfilled: "bg-green-100 text-green-800",
  Closed: "bg-gray-200 text-gray-700",
};

const urgencyColor = {
  Normal: "bg-gray-100 text-gray-700",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-700",
};

const selectClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-700 focus:outline-none";

export default function ManageRequests() {
  const [requests, setRequests] = useState(getAdminRequests());
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");

  const handleClose = (r) => {
    if (!window.confirm(`Close request ${r.code}? Donors will no longer be asked to respond.`)) {
      return;
    }
    setRequests(closeRequest(r.code));
    setMessage(`${r.code} has been closed.`);
  };

  const handleDelete = (r) => {
    if (!window.confirm(`Delete request ${r.code}? This cannot be undone.`)) return;
    setRequests(removeRequest(r.code));
    setMessage(`${r.code} has been deleted.`);
  };

  // same patient + blood group + hospital in another request = possible duplicate
  const isDuplicate = (r) =>
    requests.some(
      (o) =>
        o.code !== r.code &&
        o.patientName.toLowerCase() === r.patientName.toLowerCase() &&
        o.bloodGroup === r.bloodGroup &&
        o.hospital === r.hospital
    );

  const filtered = requests.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q || r.code.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q);
    const matchGroup = group === "All" || r.bloodGroup === group;
    const matchStatus = status === "All" || r.status === status;
    return matchSearch && matchGroup && matchStatus;
  });

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold">Manage Requests</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review all blood requests. Close finished requests and remove fake or duplicate ones.
        </p>

        {/* filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or patient name"
            className={selectClass}
          />
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={selectClass}>
            <option value="All">All blood groups</option>
            {bloodGroups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>
            ))}
          </select>
        </div>

        {message && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Showing {filtered.length} of {requests.length} requests
        </p>

        {filtered.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white p-6 text-gray-600 shadow">
            No requests match your filters.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.code} className="border-b last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {r.code}
                      {isDuplicate(r) && (
                        <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
                          Possible duplicate
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{r.patientName}</td>
                    <td className="px-4 py-3">{r.bloodGroup}</td>
                    <td className="px-4 py-3">{r.hospital}</td>
                    <td className="px-4 py-3">{r.units}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${urgencyColor[r.urgency]}`}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {(r.status === "Open" || r.status === "In Progress") && (
                          <button
                            onClick={() => handleClose(r)}
                            className="rounded-lg border border-gray-500 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r)}
                          className="rounded-lg border border-red-600 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}