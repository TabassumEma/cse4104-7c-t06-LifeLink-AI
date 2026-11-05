import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
      <p className="mt-4 text-gray-600">
        Your dashboard is coming next: cooldown status, matching requests and “I’m Going”.
      </p>
    </div>
  );
}