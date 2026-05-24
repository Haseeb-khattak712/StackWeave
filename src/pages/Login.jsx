import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          className="w-full p-3 mb-4 bg-slate-900 rounded-xl"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-6 bg-slate-900 rounded-xl"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}