import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DonorNav from "../../components/DonorNav";
import { getProfile, updateProfile, getHistory } from "../../utils/donorProfileStore";
import {
  nextEligibleDate,
  isInCooldown,
  formatDate,
  daysRemaining,
} from "../../utils/cooldown";

export default function DonorDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [d, setD] = useState(getProfile());
  const history = getHistory();

  const hasDonated = Boolean(d.lastDonation);
  const inCooldown = hasDonated && isInCooldown(d.lastDonation, d.gender);
  const nextDate = hasDonated ? nextEligibleDate(d.lastDonation, d.gender) : null;
  const visibleInMatching = d.available && !inCooldown;

  const toggleAvailability = () => setD(updateProfile({ available: !d.available }));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <DonorNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Welcome, {d.name}</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Profile */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">My Profile</h2>
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                {d.bloodGroup}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Gender</dt><dd className="capitalize">{d.gender}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Location</dt><dd>{d.location}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{d.phone}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-gray-500">
              Your phone number is shared with a requester only after you accept their request.
            </p>
            <Link to="/donor/profile" className="mt-3 inline-block text-sm font-medium text-red-600">
              Edit profile
            </Link>
          </div>

          {/* Cooldown */}
          <div className={`rounded-xl p-6 shadow ${inCooldown ? "bg-yellow-50" : "bg-green-50"}`}>
            <h2 className="font-semibold">Donation Status</h2>
            {inCooldown ? (
              <>
                <p className="mt-3 text-lg font-bold text-yellow-800">In cooldown</p>
                <p className="mt-2 text-sm text-yellow-800">
                  You can donate again from {formatDate(nextDate)}.
                </p>
                <p className="mt-1 text-sm text-yellow-800">
                  {daysRemaining(d.lastDonation, d.gender)} days remaining.
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-lg font-bold text-green-800">Eligible to donate</p>
                <p className="mt-2 text-sm text-green-800">You will appear in donor matching.</p>
              </>
            )}
            <p className="mt-3 text-xs text-gray-600">
              {hasDonated
                ? `Last donation: ${formatDate(d.lastDonation)}`
                : "No donation recorded yet"}
            </p>
          </div>

          {/* Availability */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="font-semibold">Availability</h2>
            <button
              onClick={toggleAvailability}
              disabled={inCooldown}
              className={`mt-4 w-full rounded-lg px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                d.available ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {d.available ? "Available" : "Not available"}
            </button>
            <p className="mt-3 text-sm text-gray-600">
              {inCooldown
                ? "You are hidden from matching until your cooldown ends."
                : visibleInMatching
                ? "You are visible to matching blood requests."
                : "You are hidden from matching."}
            </p>
            <Link
              to="/donor/requests"
              className="mt-4 block rounded-lg border border-red-600 px-4 py-2 text-center text-red-600 hover:bg-red-50"
            >
              View blood requests
            </Link>
          </div>
        </div>

        {/* History */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Donations</h2>
            <Link to="/donor/history" className="text-sm font-medium text-red-600">
              View all
            </Link>
          </div>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No donations recorded yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Hospital</th>
                    <th className="py-2">Blood group</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((h) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">{formatDate(h.date)}</td>
                      <td className="py-2 pr-4">{h.hospital}</td>
                      <td className="py-2">{h.bloodGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}