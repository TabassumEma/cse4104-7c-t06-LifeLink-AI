import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";
import { allDonors, allRequests } from "../../data/adminData";
import { isInCooldown } from "../../utils/cooldown";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const statusColor = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Fulfilled: "bg-green-100 text-green-800",
  Closed: "bg-gray-200 text-gray-700",
};

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // donors by blood group (PDF 4.7)
  const byGroup = bloodGroups.map((g) => ({
    group: g,
    count: allDonors.filter((d) => d.bloodGroup === g).length,
  }));
  const maxCount = Math.max(...byGroup.map((b) => b.count), 1);

  // donor statistics (PDF 4.7)
  const inCooldownNow = (d) => d.lastDonation && isInCooldown(d.lastDonation, d.gender);
  const totalDonors = allDonors.length;
  const cooldownDonors = allDonors.filter(inCooldownNow).length;
  const activeDonors = allDonors.filter(
    (d) => d.status === "Verified" && d.available && !inCooldownNow(d)
  ).length;
  const pendingDonors = allDonors.filter((d) => d.status === "Pending").length;

  // request statistics (PDF 4.7)
  const countStatus = (s) => allRequests.filter((r) => r.status === s).length;

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-700 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

        {/* statistic cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatCard label="Registered donors" value={totalDonors} color="text-gray-800" />
          <StatCard label="Active donors" value={activeDonors} color="text-green-700" />
          <StatCard label="Donors in cooldown" value={cooldownDonors} color="text-yellow-700" />
          <StatCard label="Open requests" value={countStatus("Open")} color="text-blue-700" />
          <StatCard label="In progress" value={countStatus("In Progress")} color="text-yellow-700" />
          <StatCard label="Fulfilled requests" value={countStatus("Fulfilled")} color="text-green-700" />
        </div>

        {pendingDonors > 0 && (
          <Link
            to="/admin/donors"
            className="mt-4 block rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 hover:bg-yellow-100"
          >
            {pendingDonors} donor account(s) waiting for verification. Review now
          </Link>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* blood group chart */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="font-semibold">Donors by blood group</h2>
            <div className="mt-4 space-y-2">
              {byGroup.map((b) => (
                <div key={b.group} className="flex items-center gap-3 text-sm">
                  <span className="w-10 font-semibold">{b.group}</span>
                  <div className="h-4 flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-4 rounded-full bg-red-500"
                      style={{ width: `${(b.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* recent requests */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent requests</h2>
              <Link to="/admin/requests" className="text-sm font-medium text-red-600">
                View all
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-3">Code</th>
                    <th className="py-2 pr-3">Group</th>
                    <th className="py-2 pr-3">Units</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRequests.slice(0, 5).map((r) => (
                    <tr key={r.code} className="border-b last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap">{r.code}</td>
                      <td className="py-2 pr-3">{r.bloodGroup}</td>
                      <td className="py-2 pr-3">{r.units}</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}