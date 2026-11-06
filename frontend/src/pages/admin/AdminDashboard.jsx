import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-700 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
      <p className="mt-4 text-gray-600">
        Welcome, {user.name}. Coming next: platform statistics, manage donors,
        manage requests and create admin.
      </p>
    </div>
  );
}