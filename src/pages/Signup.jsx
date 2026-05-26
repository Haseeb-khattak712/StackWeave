import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const {logout} = useAuth(); // add this to your imports/destructure


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {  // ← ADD async HERE
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setLocalError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (!email.includes("@")) {
      setLocalError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    const success = await signup(name, email, password);  // ← ADD await HERE

    if (success) {
      navigate("/dashboard", { replace: true });
    } else {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-white">Sign Up</h1>

        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error || localError}
          </div>
        )}

        <input
          type="text"
          className="w-full p-3 mb-4 bg-slate-900 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setLocalError("");
            setError(null);
          }}
          required
        />

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
          className="w-full p-3 mb-4 bg-slate-900 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLocalError("");
            setError(null);
          }}
          required
        />

        <input
          type="password"
          className="w-full p-3 mb-6 bg-slate-900 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setLocalError("");
            setError(null);
          }}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{" "}
          
          <button
            type="button"
            onClick={() => {
              logout();        // clear existing session
              navigate("/login");
            }}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}