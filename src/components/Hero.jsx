import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight"
        >
          Build Your
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            {" "}Developer Identity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Generate stunning portfolios, resumes, and developer dashboards
          powered by AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition">
            Start Building
          </button>

          <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition">
            Live Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}