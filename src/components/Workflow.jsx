import { motion } from "framer-motion";
import { FaUserEdit, FaMagic, FaRocket } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserEdit />,
    title: "Build Profile",
    desc: "Add your skills, projects, and experience in seconds.",
  },
  {
    icon: <FaMagic />,
    title: "AI Generation",
    desc: "Our AI structures your portfolio and resume intelligently.",
  },
  {
    icon: <FaRocket />,
    title: "Deploy & Share",
    desc: "Get a live portfolio link ready to impress recruiters.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-bold">
          How <span className="text-cyan-400">StackWeave</span> Works
        </h2>

        <p className="mt-4 text-slate-400">
          A simple 3-step system to build your developer identity.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl text-left"
            >
              <div className="text-3xl text-cyan-400 mb-4">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-slate-400">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}