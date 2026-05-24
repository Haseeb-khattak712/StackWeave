import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          StackWeave
        </h1>

        <div className="hidden md:flex items-center gap-8 text-slate-300">
          <a href="#">Features</a>
          <a href="#">Templates</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>

        <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}