import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import { useAuth } from "../../context/AuthContext";
import { getAdmins, addAdmin } from "../../utils/adminStore";
import { hashPassword } from "../../utils/hash";
import { formatDate } from "../../utils/cooldown";

const initial = { name: "", email: "", password: "", confirmPassword: "" };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-700 focus:outline-none";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function CreateAdmin() {
  const { user } = useAuth();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState(getAdmins());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Enter the admin's full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address.";
    if (form.password.length < 8 || !/\d/.test(form.password) || !/[A-Za-z]/.test(form.password))
      err.password = "Use at least 8 characters with letters and numbers.";
    if (form.confirmPassword !== form.password)
      err.confirmPassword = "Passwords do not match.";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    // TODO: backend তৈরি হলে এখানে axios দিয়ে POST /admins call হবে
    const passwordHash = await hashPassword(form.password);
    const result = addAdmin({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      passwordHash,
      createdBy: user.name,
    });

    if (result.ok) {
      setAdmins(getAdmins());
      setMessage(`Admin account created for ${form.name.trim()}.`);
      setForm(initial);
      setErrors({});
    } else {
      setErrors({ email: result.error });
    }
    setLoading(false);
  };

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">Create Admin</h1>
        <p className="mt-1 text-sm text-gray-600">
          Only existing admins can create new admin accounts. The public cannot register as admin.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 rounded-xl bg-white p-6 shadow"
          >
            <h2 className="font-semibold">New admin account</h2>

            <Field label="Full name" error={errors.name}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="At least 8 characters, letters and numbers"
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

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create admin"}
            </button>
          </form>

          {/* existing admins */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="font-semibold">Existing admins ({admins.length})</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Created by</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 pr-3">{a.name}</td>
                      <td className="py-2 pr-3">{a.email}</td>
                      <td className="py-2 pr-3">{a.createdBy}</td>
                      <td className="py-2 whitespace-nowrap">
                        {formatDate(new Date(a.createdAt))}
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