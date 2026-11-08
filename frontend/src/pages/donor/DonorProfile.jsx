import { useState } from "react";
import DonorNav from "../../components/DonorNav";
import { getProfile, updateProfile } from "../../utils/donorProfileStore";
import { isInCooldown, nextEligibleDate, formatDate } from "../../utils/cooldown";

const locations = [
  "Khulna", "Dhaka", "Chattogram", "Rajshahi", "Sylhet", "Barishal",
  "Rangpur", "Mymensingh", "Jashore", "Bagerhat", "Satkhira", "Narail",
  "Gazipur", "Narayanganj", "Cumilla", "Bogura",
];

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function DonorProfile() {
  const [profile, setProfile] = useState(getProfile());
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone,
    location: profile.location,
    available: profile.available,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inCooldown =
    Boolean(profile.lastDonation) && isInCooldown(profile.lastDonation, profile.gender);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Please enter your full name.";
    if (!/^01[3-9]\d{8}$/.test(form.phone))
      err.phone = "Enter a valid Bangladeshi number, e.g. 01712345678.";
    if (!form.location.trim()) err.location = "Enter your location.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    // TODO: backend তৈরি হলে এখানে axios দিয়ে PUT /donors/me call হবে
    setTimeout(() => {
      const updated = updateProfile({
        name: form.name.trim(),
        phone: form.phone,
        location: form.location.trim(),
        // in cooldown the donor stays hidden, so the setting is not changed
        available: inCooldown ? profile.available : form.available,
      });
      setProfile(updated);
      setMessage("Your profile has been updated.");
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <DonorNav />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          You can view and update only your own information. Your phone number is shared
          with a requester only after you accept their request.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 grid gap-5 rounded-xl bg-white p-6 shadow sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Field label="Full name" error={errors.name}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Blood group">
            <input value={profile.bloodGroup} disabled className={`${inputClass} bg-gray-100`} />
          </Field>

          <Field label="Gender">
            <input
              value={profile.gender === "female" ? "Female" : "Male"}
              disabled
              className={`${inputClass} bg-gray-100`}
            />
          </Field>

          <p className="text-xs text-gray-500 sm:col-span-2">
            Blood group and gender cannot be changed here because they decide your matching
            and waiting period. Contact an admin if there is a mistake.
          </p>

          <Field label="Phone number" error={errors.phone}>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              inputMode="numeric"
              maxLength={11}
            />
          </Field>

          <Field label="Location (district)" error={errors.location}>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              list="profile-locations"
              className={inputClass}
            />
            <datalist id="profile-locations">
              {locations.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </Field>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="available"
                checked={inCooldown ? profile.available : form.available}
                onChange={handleChange}
                disabled={inCooldown}
              />
              I am available to donate (visible to matching requests)
            </label>
            {inCooldown && (
              <p className="mt-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                You are in the donation waiting period, so you are hidden from matching until{" "}
                {formatDate(nextEligibleDate(profile.lastDonation, profile.gender))}.
              </p>
            )}
          </div>

          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800 sm:col-span-2">
              {message}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}