import { motion } from "framer-motion";
import {
  FaGithub,
  FaCode,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

export default function DashboardPreview() {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl shadow-black/30"
    >
      {/* TOP BAR */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="space-y-6">

        {/* PROFILE CARD */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl">
              <FaCode />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Haseeb Khattak
              </h3>

              <p className="text-slate-400 text-sm">
                Full Stack Developer
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Portfolio Score
              </p>

              <FaChartLine className="text-cyan-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              92%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Resume Status
              </p>

              <FaFileAlt className="text-cyan-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Ready
            </h2>
          </div>
        </div>

        {/* GITHUB CARD */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">
              GitHub Connected
            </p>

            <h3 className="mt-2 font-semibold">
              24 Projects Imported
            </h3>
          </div>

          <FaGithub className="text-3xl text-cyan-400" />
        </div>
      </div>
    </motion.div>
  );
}