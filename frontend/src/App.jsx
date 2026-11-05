import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/public/Home";
import Placeholder from "./pages/Placeholder";
import DonorRegister from "./pages/auth/DonorRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request" element={<Placeholder title="Request Blood" />} />
        <Route path="/track" element={<Placeholder title="Track Request" />} />
        <Route path="/donor/login" element={<Placeholder title="Donor Login" />} />
        <Route path="/donor/register" element={<DonorRegister />} />
        <Route path="/admin/login" element={<Placeholder title="Admin Login" />} />
      </Routes>
    </BrowserRouter>
  );
}