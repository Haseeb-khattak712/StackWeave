import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import PortfolioBuilder from "./pages/dashboard/PortfolioBuilder";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="builder" element={<PortfolioBuilder />} />
          <Route index element={<Overview />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}