import { useState } from "react";
import { Link } from "react-router-dom";
  import { nextEligibleDate, isInCooldown, formatDate, todayString } from "../../utils/cooldown";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const locations = [
  "Khulna", "Dhaka", "Chattogram", "Rajshahi", "Sylhet", "Barishal",
  "Rangpur", "Mymensingh", "Jashore", "Bagerhat", "Satkhira", "Narail",
  "Gazipur", "Narayanganj", "Cumilla", "Bogura",
];

const initial = {
  name: "",
  bloodGroup: "",
  gender: "",
  phone: "",
  location: "",
  neverDonated: false,
  lastDonation: "",
  password: "",
  confirmPassword: "",
};

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

export default function DonorRegister() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const today = todayString();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Please enter your full name.";
    if (!form.bloodGroup) err.bloodGroup = "Select your blood group.";
    if (!form.gender) err.gender = "Select your gender.";
    if (!/^01[3-9]\d{8}$/.test(form.phone))
      err.phone = "Enter a valid Bangladeshi number, e.g. 01712345678.";
    if (!form.location.trim()) err.location = "Enter your location.";
    if (!form.neverDonated) {
      if (!form.lastDonation)
        err.lastDonation = "Select the date, or tick “I have never donated”.";
      else if (form.lastDonation > today)
        err.lastDonation = "The date cannot be in the future.";
    }
    if (form.password.length < 8)
      err.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      err.confirmPassword = "Passwords do not match.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length === 0) {
      // TODO: backend তৈরি হলে এখানে axios দিয়ে API call হবে
      const { password, confirmPassword, ...safeData } = form;
      console.log("Donor registration:", safeData);
      setSubmitted(true);
    }
  };

  // PDF 4.4: তারিখ আর gender দিলেই পরবর্তী donation-এর তারিখ দেখাবে
  const showPreview =
    !form.neverDonated &&
    form.lastDonation &&
    form.gender &&
    form.lastDonation <= today;

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold">Registration received</h1>
        <p className="mt-2 text-gray-600">
          Thank you for becoming a donor. Your account will be verified by an
          admin before you appear in donor matching.
        </p>
        <Link
          to="/donor/login"
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Go to Donor Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-red-700">Become a Donor</h1>
      <p className="mt-2 text-gray-600">
        Register to help patients in emergencies. Your phone number is shared
        only after you accept a request.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid gap-5 rounded-xl bg-white p-6 shadow sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Field label="Full name" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Rahim Uddin"
            />
          </Field>
        </div>

        <Field label="Blood group" error={errors.bloodGroup}>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select</option>
            {bloodGroups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>

        <Field label="Gender" error={errors.gender}>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>

        <Field label="Phone number" error={errors.phone}>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="01712345678"
            inputMode="numeric"
            maxLength={11}
          />
        </Field>

        <Field label="Location (district)" error={errors.location}>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            list="locations"
            className={inputClass}
            placeholder="e.g. Khulna"
          />
          <datalist id="locations">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Last donation date" error={errors.lastDonation}>
            <input
              type="date"
              name="lastDonation"
              value={form.lastDonation}
              onChange={handleChange}
              max={today}
              disabled={form.neverDonated}
              className={`${inputClass} disabled:bg-gray-100`}
            />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="neverDonated"
              checked={form.neverDonated}
              onChange={handleChange}
            />
            I have never donated blood
          </label>

          {showPreview && (
            <p
              className={`mt-3 rounded-lg p-3 text-sm ${
                isInCooldown(form.lastDonation, form.gender)
                  ? "bg-yellow-50 text-yellow-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {isInCooldown(form.lastDonation, form.gender)
                ? `⏳ You can donate again from ${formatDate(
                    nextEligibleDate(form.lastDonation, form.gender)
                  )}.`
                : "✅ You are eligible to donate now."}
            </p>
          )}
        </div>

        <Field label="Password" error={errors.password}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword}>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Register as Donor
          </button>
          <p className="mt-3 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/donor/login" className="font-medium text-red-600">
              Donor Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}