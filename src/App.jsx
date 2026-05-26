import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Builder from "./pages/dashboard/Builder";
import DashboardLayout from "./layouts/DashboardLayout";
import AIGenerator from "./pages/dashboard/AIGenerator";
import Overview from "./pages/dashboard/Overview";
import Profile from "./pages/dashboard/Profile";
import { PortfolioProvider } from "./context/PortfolioContext";

export default function App() {
  return (
    <PortfolioProvider>  
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/builder" element={<Builder />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="builder" element={<Builder />} />
          <Route path="ai" element={<AIGenerator />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </PortfolioProvider>
  );
}