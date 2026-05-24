import { motion } from "framer-motion";
import {
  FaBrain,
  FaFileAlt,
  FaPalette,
  FaGithub,
  FaChartLine,
  FaBolt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBrain />,
    title: "AI Portfolio Builder",
    desc: "Generate intelligent portfolios based on your profile.",
  },
  {
    icon: <FaFileAlt />,
    title: "ATS Resume Engine",
    desc: "Create recruiter-optimized resumes instantly.",
  },
  {
    icon: <FaPalette />,
    title: "Theme System",
    desc: "Choose premium developer-focused themes.",
  },
  {
    icon: <FaGithub />,
    title: "GitHub Sync",
    desc: "Import projects automatically from GitHub.",
  },
  {
    icon: <FaChartLine />,
    title: "Analytics Dashboard",
    desc: "Track portfolio performance and visibility.",
  },
  {
    icon: <FaBolt />,
    title: "Lightning Fast",
    desc: "Instant generation with optimized performance.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-bold">
          Powerful <span className="text-cyan-400">Features</span>
        </h2>

        <p className="mt-4 text-slate-400">
          Everything you need to build your developer identity.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="p-7 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-left"
            >
              <div className="text-2xl text-cyan-400 mb-4">
                {f.icon}
              </div>

              <h3 className="text-lg font-semibold">
                {f.title}
              </h3>

              <p className="mt-2 text-slate-400 text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}