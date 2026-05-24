import { motion } from "framer-motion";
import { FaRobot, FaFileAlt, FaPalette } from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Portfolio Generator",
    desc: "Generate personalized developer portfolios instantly.",
  },
  {
    icon: <FaFileAlt />,
    title: "ATS Resume Builder",
    desc: "Create professional resumes optimized for recruiters.",
  },
  {
    icon: <FaPalette />,
    title: "Custom Themes",
    desc: "Choose premium themes tailored to your developer style.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="text-4xl text-indigo-400 mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}