import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, email, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

        <input
          className="w-full p-3 mb-4 bg-slate-900 rounded-xl"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

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
          Create Account
        </button>
      </form>
    </div>
  );
}