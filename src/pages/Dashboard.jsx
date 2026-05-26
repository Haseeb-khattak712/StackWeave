
import AIGenerator from "./dashboard/AIGenerator";
import { useEffect, useState } from "react";
import { getOutputs } from "../services/saveOutput";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOutputs();
      setOutputs(data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0b0f19] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] p-5 border-r border-white/10">
        <h1 className="text-xl font-bold mb-8">StackWeave</h1>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab("overview")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "overview" ? "bg-indigo-600" : ""
            }`}>
            Overview
          </button>

          <button onClick={() => setActiveTab("generator")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "generator" ? "bg-indigo-600" : ""
            }`}>
            AI Generator
          </button>

          <button onClick={() => setActiveTab("projects")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "projects" ? "bg-indigo-600" : ""
            }`}>
            My Projects
          </button>

          <button onClick={() => setActiveTab("settings")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "settings" ? "bg-indigo-600" : ""
            }`}>
            Settings
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-sm text-gray-400">AI Generations</h3>
                <p className="text-2xl font-bold">12</p>
              </div>

              <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-sm text-gray-400">Saved Projects</h3>
                <p className="text-2xl font-bold">3</p>
              </div>

              <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-sm text-gray-400">Resume Score</h3>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </div>
        )}

        {/* AI GENERATOR */}
        {activeTab === "generator" && (
          <AIGenerator />
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My AI Outputs</h2>

            {outputs.length === 0 ? (
              <p className="text-gray-400">No saved outputs yet.</p>
            ) : (
              <div className="space-y-4">
                {outputs.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-white/5 border border-white/10"
                  >
                    <h3 className="font-semibold">
                      {item.profile?.name || "Unknown"}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      {item.result?.summary}
                    </p>

                    <span className="text-xs text-indigo-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-400">
              Profile settings and preferences.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}