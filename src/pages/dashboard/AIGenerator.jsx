import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { generatePortfolio } from "../../services/aigenerator";
import { loadFromStorage } from "../../services/storage";
import { saveOutput } from "../../services/saveOutput";

export default function AIGenerator() {
  const { user, token } = useAuth();
  const { applyAiContent } = usePortfolio();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      // load profile from storage
      const profile = loadFromStorage("profile") || {
        name: "Haseeb",
        title: "Full Stack Developer",
        bio: "I build modern web applications using React and Node.js.",
      };

      // load projects from storage
      const projects = loadFromStorage("projects") || [
        {
          title: "Portfolio Builder",
          desc: "AI-powered portfolio platform",
        },
      ];

      // generate AI response
      const output = await generatePortfolio(profile, projects, token);

      // SAVE TO BACKEND
      await saveOutput(
        {
          profile,
          projects,
          generatedContent: output,
          modelUsed: output.modelUsed,
        },
        token
      );

      // Apply generated content to the builder and redirect there
      applyAiContent({
        bio: output.bio,
        summary: output.summary,
        projects: output.projects,
      });
      navigate("/dashboard/builder");

      setResult(output);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI portfolio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">
          AI Portfolio Generator
        </h1>

        <p className="text-slate-400 max-w-2xl">
          Generate enhanced portfolio summaries, bios, and project
          descriptions using AI.
        </p>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate with AI"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-10 space-y-6">

          {/* FALLBACK NOTICE */}
          {result.fallback && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
              Gemini quota unavailable. Using fallback AI system.
            </div>
          )}

          {/* SUMMARY */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <h2 className="text-xl font-semibold mb-3">
              Professional Summary
            </h2>

            <p className="text-slate-300 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* BIO */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <h2 className="text-xl font-semibold mb-3">
              Enhanced Bio
            </h2>

            <p className="text-slate-300 leading-relaxed">
              {result.bio}
            </p>
          </div>

          {/* PROJECTS */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Enhanced Projects
            </h2>

            {result.projects.map((project, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-white/10 bg-slate-900/70"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {project.title}
                </h3>

                <p className="text-slate-400">
                  {project.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}