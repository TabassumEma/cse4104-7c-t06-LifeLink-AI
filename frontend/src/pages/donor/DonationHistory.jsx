import { useState } from "react";
import DonorNav from "../../components/DonorNav";
import {
  getProfile,
  getHistory,
  addDonation,
  updateDonation,
  deleteDonation,
} from "../../utils/donorProfileStore";
  import { nextEligibleDate, formatDate, todayString } from "../../utils/cooldown";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none";

const emptyForm = { date: "", hospital: "" };

export default function DonationHistory() {
  const [profile, setProfile] = useState(getProfile());
  const [history, setHistory] = useState(getHistory());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const today = todayString();
  const hasDonated = Boolean(profile.lastDonation);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};
    if (!form.date) err.date = "Select the donation date.";
    else if (form.date > today) err.date = "The date cannot be in the future.";
    else if (history.some((h) => h.date === form.date && h.id !== editingId))
      err.date = "A donation is already recorded on this date.";
    if (form.hospital.trim().length < 3) err.hospital = "Enter the hospital name.";
    return err;
  };

  const refresh = () => {
    setHistory(getHistory());
    setProfile(getProfile());
  };

  // message shown after every change, based on the newest donation
  const eligibleMessage = (prefix) => {
    const p = getProfile();
    if (!p.lastDonation) return `${prefix} You are eligible to donate now.`;
    return `${prefix} You can donate again from ${formatDate(
      nextEligibleDate(p.lastDonation, p.gender)
    )}.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO: backend তৈরি হলে এখানে axios দিয়ে POST/PUT /donations call হবে
    const data = { date: form.date, hospital: form.hospital.trim() };
    if (editingId) {
      updateDonation(editingId, data);
      refresh();
      setMessage(eligibleMessage("Donation updated."));
    } else {
      addDonation(data);
      refresh();
      setMessage(eligibleMessage("Donation recorded."));
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setForm({ date: h.date, hospital: h.hospital });
    setErrors({});
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleDelete = (h) => {
    const ok = window.confirm(
      `Delete the donation on ${formatDate(h.date)}? Your next eligible date will be recalculated.`
    );
    if (!ok) return;
    deleteDonation(h.id);
    if (editingId === h.id) cancelEdit();
    refresh();
    setMessage(eligibleMessage("Donation deleted."));
  };

  return (
    <div>
      <DonorNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">Donation History</h1>

        {/* summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total donations</p>
            <p className="mt-1 text-3xl font-bold">{history.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Last donation</p>
            <p className="mt-1 text-lg font-bold">
              {hasDonated ? formatDate(profile.lastDonation) : "None yet"}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Next eligible date</p>
            <p className="mt-1 text-lg font-bold">
              {hasDonated
                ? formatDate(nextEligibleDate(profile.lastDonation, profile.gender))
                : "Now"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* record or edit a donation */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 rounded-xl bg-white p-6 shadow md:col-span-1"
          >
            <h2 className="font-semibold">
              {editingId ? "Edit donation" : "Record a donation"}
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium">Donation date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={today}
                className={inputClass}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Hospital</label>
              <input
                name="hospital"
                value={form.hospital}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Khulna Medical College Hospital"
              />
              {errors.hospital && (
                <p className="mt-1 text-sm text-red-600">{errors.hospital}</p>
              )}
            </div>

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              {editingId ? "Update donation" : "Save donation"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full rounded-lg border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <p className="text-xs text-gray-500">
              Your waiting period is counted from your newest donation, so please enter the
              correct date.
            </p>
          </form>

          {/* history table */}
          <div className="rounded-xl bg-white p-6 shadow md:col-span-2">
            <h2 className="font-semibold">All donations</h2>
            {history.length === 0 ? (
              <p className="mt-4 text-sm text-gray-600">No donations recorded yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Hospital</th>
                      <th className="py-2 pr-4">Blood group</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr
                        key={h.id}
                        className={`border-b last:border-0 ${
                          h.id === editingId ? "bg-yellow-50" : ""
                        }`}
                      >
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {formatDate(h.date)}
                        </td>
                        <td className="py-2 pr-4">{h.hospital}</td>
                        <td className="py-2 pr-4">{h.bloodGroup}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(h)}
                              className="rounded-lg border border-gray-500 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(h)}
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
      </div>
    </div>
  );
}