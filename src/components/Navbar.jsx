import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-4 shadow-2xl shadow-black/20">
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

            <h1 className="text-2xl font-bold tracking-tight">
              Stack<span className="text-cyan-400">Weave</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a
              href="#features"
              className="hover:text-white transition"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="hover:text-white transition"
            >
              Workflow
            </a>

            <a
              href="#templates"
              className="hover:text-white transition"
            >
              Templates
            </a>

            <a
              href="#pricing"
              className="hover:text-white transition"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:block text-sm text-slate-300 hover:text-white transition">
              Login
            </button>

            <button className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-sm font-medium text-slate-950">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}