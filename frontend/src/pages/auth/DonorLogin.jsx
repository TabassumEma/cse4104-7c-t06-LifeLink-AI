import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none";

export default function DonorLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("Enter a valid Bangladeshi phone number, e.g. 01712345678.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    // TODO: backend তৈরি হলে এখানে axios দিয়ে /login API call হবে
    setTimeout(() => {
      if (phone === "01712345678" && password === "12345678") {
        login({ name: "Rahim Uddin", role: "donor" });
        navigate("/donor/dashboard");
      } else {
        setError("Invalid phone number or password.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-red-700">Donor Login</h1>
      <p className="mt-2 text-gray-600">
        Log in to manage your profile and respond to blood requests.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label className="mb-1 block text-sm font-medium">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="01712345678"
            inputMode="numeric"
            maxLength={11}
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
          className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm text-gray-600">
          New donor?{" "}
          <Link to="/donor/register" className="font-medium text-red-600">
            Register here
          </Link>
        </p>
      </form>

      <p className="mt-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-600">
        Prototype demo account: phone <b>01712345678</b>, password <b>12345678</b>
      </p>
    </div>
  );
}