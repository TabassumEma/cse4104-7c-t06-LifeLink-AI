import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import { getDonors, setDonorStatus } from "../../utils/donorStore";
import { isInCooldown, nextEligibleDate, formatDate } from "../../utils/cooldown";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const statuses = ["All", "Verified", "Pending", "Blocked"];

const statusColor = {
  Verified: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Blocked: "bg-red-100 text-red-700",
};

const selectClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-700 focus:outline-none";

export default function ManageDonors() {
  const [donors, setDonors] = useState(getDonors());
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");

  const changeStatus = (donor, newStatus) => {
    if (
      newStatus === "Blocked" &&
      !window.confirm(`Block ${donor.name}? They will no longer appear in donor matching.`)
    ) {
      return;
    }
    setDonors(setDonorStatus(donor.id, newStatus));
    setMessage(`${donor.name} is now ${newStatus}.`);
  };

  const filtered = donors.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.phone.includes(q);
    const matchGroup = group === "All" || d.bloodGroup === group;
    const matchStatus = status === "All" || d.status === status;
    return matchSearch && matchGroup && matchStatus;
  });

  const cooldownText = (d) => {
    if (!d.lastDonation) return "Never donated";
    if (isInCooldown(d.lastDonation, d.gender)) {
      return `Until ${formatDate(nextEligibleDate(d.lastDonation, d.gender))}`;
    }
    return "Eligible";
  };

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold">Manage Donors</h1>
        <p className="mt-1 text-sm text-gray-600">
          Verify new donor accounts and block fake or misused accounts.
        </p>

        {/* filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone"
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
          Showing {filtered.length} of {donors.length} donors
        </p>

        {filtered.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white p-6 text-gray-600 shadow">
            No donors match your filters.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Cooldown</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3">{d.bloodGroup}</td>
                    <td className="px-4 py-3 capitalize">{d.gender}</td>
                    <td className="px-4 py-3">{d.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{d.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{cooldownText(d)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {d.status === "Pending" && (
                          <button
                            onClick={() => changeStatus(d, "Verified")}
                            className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Verify
                          </button>
                        )}
                        {d.status !== "Blocked" && (
                          <button
                            onClick={() => changeStatus(d, "Blocked")}
                            className="rounded-lg border border-red-600 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Block
                          </button>
                        )}
                        {d.status === "Blocked" && (
                          <button
                            onClick={() => changeStatus(d, "Verified")}
                            className="rounded-lg border border-gray-500 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Unblock
                          </button>
                        )}
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