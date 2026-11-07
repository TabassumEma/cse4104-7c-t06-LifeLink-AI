import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { verifyAdmin } from "../../utils/adminStore";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-700 focus:outline-none";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    // TODO: backend তৈরি হলে এখানে axios দিয়ে admin login API call হবে
    const admin = await verifyAdmin(email, password);
    setTimeout(() => {
      if (admin) {
        login({ name: admin.name, email: admin.email, role: "admin" });
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
      <p className="mt-2 text-gray-600">
        For authorized administrators only. Admin accounts can be created only by
        an existing admin.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in as Admin"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Are you a donor?{" "}
          <Link to="/donor/login" className="font-medium text-red-600">
            Donor Login
          </Link>
        </p>
      </form>

      <p className="mt-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-600">
        Prototype demo admin: <b>admin@lifelink.com</b> / <b>admin1234</b>
      </p>
    </div>
  );
}