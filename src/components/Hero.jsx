import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            AI-Powered Developer Branding Platform
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Build Your
            <span className="block text-cyan-400">
              Developer Identity
            </span>
          </h1>

          <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-xl">
            StackWeave helps developers create stunning portfolios,
            ATS-friendly resumes, and professional personal brands
            powered by intelligent automation.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-slate-950 shadow-lg shadow-cyan-500/20">
              Start Building
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition">
              Watch Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-slate-500">
            <div>
              <span className="text-white font-semibold">10K+</span>
              <p>Portfolios Generated</p>
            </div>

            <div>
              <span className="text-white font-semibold">95%</span>
              <p>ATS Optimization</p>
            </div>

            <div>
              <span className="text-white font-semibold">AI</span>
              <p>Powered Insights</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}