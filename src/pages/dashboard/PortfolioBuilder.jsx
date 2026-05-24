import { useEffect, useState } from "react";
import { saveToStorage, loadFromStorage } from "../../services/storage";

export default function PortfolioBuilder() {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
  });

  const [projects, setProjects] = useState([]);

  const [projectInput, setProjectInput] = useState({
    title: "",
    desc: "",
  });

  const [saved, setSaved] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = loadFromStorage("profile");
    const savedProjects = loadFromStorage("projects");

    if (savedProfile) setProfile(savedProfile);
    if (savedProjects) setProjects(savedProjects);
  }, []);

  // Auto-save profile
  useEffect(() => {
    saveToStorage("profile", profile);

    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(t);
  }, [profile]);

  // Auto-save projects
  useEffect(() => {
    saveToStorage("projects", projects);

    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(t);
  }, [projects]);

  const addProject = () => {
    if (!projectInput.title.trim()) return;

    setProjects([...projects, projectInput]);
    setProjectInput({ title: "", desc: "" });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">

      {/* LEFT SIDE */}
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Portfolio Builder
          </h1>

          {saved && (
            <p className="text-green-400 text-sm mt-2">
              Auto-saved
            </p>
          )}
        </div>

        {/* PROFILE FORM */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">

          <input
            placeholder="Name"
            className="w-full p-3 bg-slate-900 rounded-xl outline-none"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />

          <input
            placeholder="Title (e.g. Full Stack Developer)"
            className="w-full p-3 bg-slate-900 rounded-xl outline-none"
            value={profile.title}
            onChange={(e) =>
              setProfile({ ...profile, title: e.target.value })
            }
          />

          <textarea
            placeholder="Bio"
            className="w-full p-3 bg-slate-900 rounded-xl outline-none"
            value={profile.bio}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
          />
        </div>

        {/* PROJECTS */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">

          <h2 className="font-semibold text-lg">
            Add Project
          </h2>

          <input
            placeholder="Project Title"
            className="w-full p-3 bg-slate-900 rounded-xl outline-none"
            value={projectInput.title}
            onChange={(e) =>
              setProjectInput({
                ...projectInput,
                title: e.target.value,
              })
            }
          />

          <input
            placeholder="Project Description"
            className="w-full p-3 bg-slate-900 rounded-xl outline-none"
            value={projectInput.desc}
            onChange={(e) =>
              setProjectInput({
                ...projectInput,
                desc: e.target.value,
              })
            }
          />

          <button
            onClick={addProject}
            className="px-6 py-3 bg-cyan-500 text-black rounded-xl font-semibold hover:bg-cyan-400 transition"
          >
            Add Project
          </button>

          {/* PROJECT LIST */}
          <div className="space-y-2 mt-4">
            {projects.map((p, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900 border border-white/10"
              >
                <p className="font-semibold">{p.title}</p>
                <p className="text-slate-400 text-sm">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT SIDE — LIVE PREVIEW */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5">

        <h2 className="text-2xl font-bold mb-4">
          Live Preview
        </h2>

        <div className="space-y-4">

          <h3 className="text-3xl font-bold">
            {profile.name || "Your Name"}
          </h3>

          <p className="text-cyan-400">
            {profile.title || "Your Title"}
          </p>

          <p className="text-slate-400">
            {profile.bio || "Your bio will appear here..."}
          </p>

          <div className="mt-6">

            <h4 className="font-semibold mb-2">
              Projects
            </h4>

            {projects.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No projects added yet
              </p>
            ) : (
              projects.map((p, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 rounded-xl bg-slate-900 border border-white/10"
                >
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-slate-400">
                    {p.desc}
                  </p>
                </div>
              ))
            )}

          </div>

        </div>
      </div>

    </div>
  );
}