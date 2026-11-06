import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/public/Home";
import Placeholder from "./pages/Placeholder";
import DonorRegister from "./pages/auth/DonorRegister";
import DonorLogin from "./pages/auth/DonorLogin";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<Placeholder title="Request Blood" />} />
          <Route path="/track" element={<Placeholder title="Track Request" />} />
          <Route path="/donor/login" element={<DonorLogin />} />
          <Route path="/donor/register" element={<DonorRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute role="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
        <Route
  path="/donor/requests"
  element={
    <ProtectedRoute role="donor">
      <Placeholder title="Matching Requests" />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin/donors"
  element={
    <ProtectedRoute role="admin">
      <Placeholder title="Manage Donors" />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/requests"
  element={
    <ProtectedRoute role="admin">
      <Placeholder title="Manage Requests" />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/create"
  element={
    <ProtectedRoute role="admin">
      <Placeholder title="Create Admin" />
    </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}