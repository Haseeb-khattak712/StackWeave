import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, state: { message: "You have been logged out successfully" } });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 border-r border-white/10 p-6">
        <h1 className="text-2xl font-bold mb-10 text-cyan-400">StackWeave</h1>

        <nav className="flex flex-col gap-4 text-slate-300">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-left hover:text-white transition-colors"
          >
            Overview
          </button>

          <button
            onClick={() => navigate("/dashboard/profile")}
            className="text-left hover:text-white transition-colors"
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/dashboard/builder")}
            className="text-left hover:text-white transition-colors"
          >
            Portfolio Builder
          </button>

          <button
            className="text-red-400 mt-10 text-left hover:text-red-300 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-semibold">
            Welcome, {user?.name || "Developer"}
          </h2>
          <div className="text-sm text-slate-400">Developer Dashboard</div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}