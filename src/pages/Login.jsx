import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { user, login, logout, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {  // ← ADD async HERE
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);  // ← ADD await HERE

    if (success) {
      navigate("/dashboard", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-[400px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-400 mb-6">You are already logged in.</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => logout()}
              className="w-full py-3 border border-red-500/50 text-red-400 font-semibold rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Login</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
            ✓ {successMessage}
          </div>
        )}

        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error || localError}
          </div>
        )}

        <input
          type="email"
          className="w-full p-3 mb-4 bg-slate-900 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLocalError("");
            setError(null);
          }}
          required
        />

        <input
          type="password"
          className="w-full p-3 mb-6 bg-slate-900 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLocalError("");
            setError(null);
          }}
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition-colors"
        >
          Login
        </button>

        <p className="text-center text-slate-400 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}