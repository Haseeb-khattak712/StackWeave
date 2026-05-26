import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Builder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // ─── LAYOUT ───
  const [layout, setLayout] = useState("modern");

  const layouts = {
    modern: {
      font: "font-sans",
      rounded: "rounded-3xl",
      cardStyle: "bg-white/5 border border-white/10 backdrop-blur-xl",
      heroStyle: "bg-gradient-to-br",
      projectGrid: "md:grid-cols-2",
      testimonialGrid: "grid-cols-1",
      statsGrid: "md:grid-cols-4",
      sectionSpacing: "mb-8",
    },
    minimal: {
      font: "font-sans",
      rounded: "rounded-lg",
      cardStyle: "bg-transparent border-b border-white/10",
      heroStyle: "bg-transparent",
      projectGrid: "grid-cols-1",
      testimonialGrid: "grid-cols-1",
      statsGrid: "grid-cols-2",
      sectionSpacing: "mb-12",
    },
    creative: {
      font: "font-serif",
      rounded: "rounded-2xl",
      cardStyle: "bg-gradient-to-br from-white/10 to-white/5 border border-white/20",
      heroStyle: "bg-gradient-to-tr",
      projectGrid: "md:grid-cols-2",
      testimonialGrid: "md:grid-cols-2",
      statsGrid: "md:grid-cols-4",
      sectionSpacing: "mb-10",
    },
  };

  const currentLayout = layouts[layout];

  // ─── THEME ───
  const [theme, setTheme] = useState({
    accent: "indigo",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
  });

  const themes = [
    { name: "Indigo", accent: "indigo", bg: "from-indigo-500/20 to-purple-500/20" },
    { name: "Cyan", accent: "cyan", bg: "from-cyan-500/20 to-blue-500/20" },
    { name: "Emerald", accent: "emerald", bg: "from-emerald-500/20 to-teal-500/20" },
    { name: "Rose", accent: "rose", bg: "from-rose-500/20 to-orange-500/20" },
    { name: "Slate", accent: "slate", bg: "from-slate-500/20 to-gray-500/20" },
  ];

  const accentMap = {
    indigo: "text-indigo-300 bg-indigo-500/20 border-indigo-500/30",
    cyan: "text-cyan-300 bg-cyan-500/20 border-cyan-500/30",
    emerald: "text-emerald-300 bg-emerald-500/20 border-emerald-500/30",
    rose: "text-rose-300 bg-rose-500/20 border-rose-500/30",
    slate: "text-slate-300 bg-slate-500/20 border-slate-500/30",
  };

  const accentText = {
    indigo: "text-indigo-300",
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    rose: "text-rose-300",
    slate: "text-slate-300",
  };

  const accentBorder = {
    indigo: "border-indigo-500/30",
    cyan: "border-cyan-500/30",
    emerald: "border-emerald-500/30",
    rose: "border-rose-500/30",
    slate: "border-slate-500/30",
  };

  // ─── SECTION VISIBILITY ───
  const [visible, setVisible] = useState({
    hero: true,
    stats: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    testimonials: true,
    certifications: true,
    contact: true,
  });

  // ─── PORTFOLIO DATA ───
  const [portfolio, setPortfolio] = useState({
    name: user?.name || "Haseeb Khattak",
    title: "Full Stack Developer",
    bio: "Building modern AI-powered web applications with React, Node.js, and MongoDB. Passionate about clean code and great user experiences.",
    avatar: "",
    email: user?.email || "haseeb@example.com",
    location: "Remote / Worldwide",
    stats: [
      { label: "Years Experience", value: "3+" },
      { label: "Projects Built", value: "12" },
      { label: "Technologies", value: "15+" },
      { label: "Happy Clients", value: "8" },
    ],
    skills: ["React", "Node.js", "MongoDB", "Tailwind", "TypeScript", "Python", "Express", "Git"],
    projects: [
      { title: "StackWeave", desc: "AI-powered portfolio SaaS platform with Groq integration.", tech: ["React", "Node.js", "MongoDB"], link: "https://github.com" },
      { title: "DevConnect", desc: "Social network for developers with real-time chat.", tech: ["Socket.io", "Express", "JWT"], link: "" },
    ],
    experience: [
      { role: "Full Stack Developer", company: "Freelance", period: "2023 - Present", desc: "Building web apps for clients worldwide." },
    ],
    education: [
      { degree: "BS Computer Science", school: "University", year: "2020 - 2024" },
    ],
    testimonials: [
      { name: "Client A", role: "Startup Founder", text: "Haseeb delivered beyond expectations. Highly recommended!" },
    ],
    certifications: [
      { name: "AWS Cloud Practitioner", issuer: "Amazon", year: "2024" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      website: "",
    },
  });

  // ─── HELPERS ───
  const update = (field, value) => setPortfolio((p) => ({ ...p, [field]: value }));
  const addItem = (field, item) => update(field, [...portfolio[field], item]);
  const removeItem = (field, index) => update(field, portfolio[field].filter((_, i) => i !== index));
  const updateItem = (field, index, key, value) => {
    const arr = [...portfolio[field]];
    arr[index] = { ...arr[index], [key]: value };
    update(field, arr);
  };
  const toggleSection = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));

  // ─── AI ENHANCE (INLINE — no navigation loop) ───
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const enhanceWithAI = async () => {
    const token = localStorage.getItem("stackweave_token");
    setAiLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          profile: { name: portfolio.name, title: portfolio.title, bio: portfolio.bio },
          projects: portfolio.projects,
        }),
      });

      if (!res.ok) throw new Error(`AI service error: ${res.status}`);

      const data = await res.json();
      if (data.bio) update("bio", data.bio);
      if (data.summary) update("title", data.summary);
      if (data.projects) {
        update("projects", data.projects.map((p) => ({ ...p, tech: p.tech || [], link: p.link || "" })));
      }
      alert("✨ AI enhancement applied!");
      setAiPanelOpen(false);
    } catch (err) {
      console.error("AI enhance failed:", err);
      alert("❌ AI enhancement failed: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // ─── EXPORT PDF (FIXED) ───
  const [pdfLoading, setPdfLoading] = useState(false);

  const exportPDF = async () => {
    const element = previewRef.current;
    if (!element) {
      alert("Preview not ready");
      return;
    }

    setPdfLoading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0b0f19",
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${portfolio.name.replace(/\s+/g, "-").toLowerCase()}-portfolio.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("❌ PDF export failed: " + err.message);
    } finally {
      setPdfLoading(false);
    }
  };

  // ─── SAVE TO BACKEND (FIXED) ───
  const [saveLoading, setSaveLoading] = useState(false);

  const saveToBackend = async () => {
    const token = localStorage.getItem("stackweave_token");
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    setSaveLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/save-output`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          userId: user?._id,
          profile: {
            name: portfolio.name,
            title: portfolio.title,
            bio: portfolio.bio,
          },
          projects: portfolio.projects,
          generatedContent: {
            bio: portfolio.bio,
            summary: portfolio.title,
            projects: portfolio.projects,
          },
          modelUsed: "manual-builder",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${res.status}`);
      }

      const data = await res.json();
      alert("✅ Portfolio saved to your account!");
      return data;
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0b0f19] text-white flex overflow-hidden">

      {/* ═══════════════════════════════════════
          LEFT SIDEBAR — EDITOR
      ═══════════════════════════════════════ */}
      <div className="w-[420px] border-r border-white/10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold">Portfolio Builder</h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* ─── ACTION BUTTONS ─── */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className="col-span-2 py-2.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition"
            >
              {aiPanelOpen ? "Close AI Panel" : "✨ Generate with AI"}
            </button>
            <button
              onClick={exportPDF}
              disabled={pdfLoading}
              className="py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-medium transition disabled:opacity-50"
            >
              {pdfLoading ? "Exporting..." : "Export PDF"}
            </button>
            <button
              onClick={saveToBackend}
              disabled={saveLoading}
              className="py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 text-xs font-medium transition disabled:opacity-50"
            >
              {saveLoading ? "Saving..." : "💾 Save"}
            </button>
          </div>

          {/* ─── AI PANEL (INLINE — no routing loop) ─── */}
          {aiPanelOpen && (
            <div className="p-4 rounded-xl bg-white/5 border border-purple-500/30 space-y-3">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">AI Enhancement</h3>
              <p className="text-xs text-gray-400">
                This will rewrite your bio, title, and project descriptions using AI.
              </p>
              <button
                onClick={enhanceWithAI}
                disabled={aiLoading}
                className="w-full py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition disabled:opacity-50"
              >
                {aiLoading ? "Generating..." : "✨ Enhance Portfolio with AI"}
              </button>
            </div>
          )}

          {/* ─── LAYOUT ─── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Layout</h3>
            <div className="flex gap-2">
              {["modern", "minimal", "creative"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={`flex-1 py-2 rounded-lg text-xs capitalize font-medium border transition ${
                    layout === l
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* ─── THEME ─── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Theme</h3>
            <div className="flex gap-2 flex-wrap">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme({ accent: t.accent, bgGradient: t.bg })}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                    theme.accent === t.accent ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* ─── SECTION TOGGLES ─── */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sections</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(visible).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={visible[key]} onChange={() => toggleSection(key)} className="accent-cyan-500" />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ─── BASIC INFO ─── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h3>
            <input value={portfolio.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <input value={portfolio.title} onChange={(e) => update("title", e.target.value)} placeholder="Title" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <input value={portfolio.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <input value={portfolio.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <input value={portfolio.avatar} onChange={(e) => update("avatar", e.target.value)} placeholder="Avatar URL" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            <div className="relative">
              <textarea rows={4} value={portfolio.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Bio" className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
            </div>
          </div>

          {/* ─── SOCIAL ─── */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Social</h3>
            {Object.entries(portfolio.social).map(([key, val]) => (
              <div key={key} className="flex gap-2">
                <span className="text-xs text-gray-500 w-16 pt-2.5 capitalize">{key}</span>
                <input value={val} onChange={(e) => update("social", { ...portfolio.social, [key]: e.target.value })} placeholder={`https://${key}.com`} className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm" />
              </div>
            ))}
          </div>

          {/* ─── STATS ─── */}
          {visible.stats && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Stats</h3>
              {portfolio.stats.map((stat, i) => (
                <div key={i} className="flex gap-2">
                  <input value={stat.value} onChange={(e) => { const s = [...portfolio.stats]; s[i].value = e.target.value; update("stats", s); }} className="w-20 p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={stat.label} onChange={(e) => { const s = [...portfolio.stats]; s[i].label = e.target.value; update("stats", s); }} className="flex-1 p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <button onClick={() => removeItem("stats", i)} className="text-red-400 px-2">×</button>
                </div>
              ))}
              <button onClick={() => addItem("stats", { label: "New Stat", value: "0" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Stat</button>
            </div>
          )}

          {/* ─── SKILLS ─── */}
          {visible.skills && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                    {skill}
                    <button onClick={() => removeItem("skills", i)} className="text-red-400 text-xs ml-1">×</button>
                  </span>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const input = e.target.skill; if (input.value.trim()) addItem("skills", input.value.trim()); input.value = ""; }} className="flex gap-2">
                <input name="skill" placeholder="Add skill..." className="flex-1 p-2 rounded bg-white/5 border border-white/10 text-sm" />
                <button type="submit" className="px-3 py-2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm">+</button>
              </form>
            </div>
          )}

          {/* ─── PROJECTS ─── */}
          {visible.projects && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Projects</h3>
              {portfolio.projects.map((proj, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-gray-400">Project {i + 1}</span>
                    <button onClick={() => removeItem("projects", i)} className="text-red-400 text-xs">Remove</button>
                  </div>
                  <input value={proj.title} onChange={(e) => updateItem("projects", i, "title", e.target.value)} placeholder="Title" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <textarea value={proj.desc} onChange={(e) => updateItem("projects", i, "desc", e.target.value)} placeholder="Description" rows={2} className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={proj.link} onChange={(e) => updateItem("projects", i, "link", e.target.value)} placeholder="Project URL" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={proj.tech?.join(", ")} onChange={(e) => updateItem("projects", i, "tech", e.target.value.split(",").map((t) => t.trim()))} placeholder="Tech: React, Node, Mongo" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                </div>
              ))}
              <button onClick={() => addItem("projects", { title: "New Project", desc: "", tech: [], link: "" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Project</button>
            </div>
          )}

          {/* ─── EXPERIENCE ─── */}
          {visible.experience && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Experience</h3>
              {portfolio.experience.map((exp, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <input value={exp.role} onChange={(e) => updateItem("experience", i, "role", e.target.value)} placeholder="Role" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={exp.company} onChange={(e) => updateItem("experience", i, "company", e.target.value)} placeholder="Company" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={exp.period} onChange={(e) => updateItem("experience", i, "period", e.target.value)} placeholder="2023 - Present" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <textarea value={exp.desc} onChange={(e) => updateItem("experience", i, "desc", e.target.value)} placeholder="Description" rows={2} className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <button onClick={() => removeItem("experience", i)} className="text-xs text-red-400">Remove</button>
                </div>
              ))}
              <button onClick={() => addItem("experience", { role: "", company: "", period: "", desc: "" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Experience</button>
            </div>
          )}

          {/* ─── EDUCATION ─── */}
          {visible.education && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Education</h3>
              {portfolio.education.map((edu, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <input value={edu.degree} onChange={(e) => updateItem("education", i, "degree", e.target.value)} placeholder="Degree" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={edu.school} onChange={(e) => updateItem("education", i, "school", e.target.value)} placeholder="School" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={edu.year} onChange={(e) => updateItem("education", i, "year", e.target.value)} placeholder="Year" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <button onClick={() => removeItem("education", i)} className="text-xs text-red-400">Remove</button>
                </div>
              ))}
              <button onClick={() => addItem("education", { degree: "", school: "", year: "" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Education</button>
            </div>
          )}

          {/* ─── TESTIMONIALS ─── */}
          {visible.testimonials && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Testimonials</h3>
              {portfolio.testimonials.map((t, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <input value={t.name} onChange={(e) => updateItem("testimonials", i, "name", e.target.value)} placeholder="Name" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={t.role} onChange={(e) => updateItem("testimonials", i, "role", e.target.value)} placeholder="Role" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <textarea value={t.text} onChange={(e) => updateItem("testimonials", i, "text", e.target.value)} placeholder="Quote" rows={2} className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <button onClick={() => removeItem("testimonials", i)} className="text-xs text-red-400">Remove</button>
                </div>
              ))}
              <button onClick={() => addItem("testimonials", { name: "", role: "", text: "" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Testimonial</button>
            </div>
          )}

          {/* ─── CERTIFICATIONS ─── */}
          {visible.certifications && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Certifications</h3>
              {portfolio.certifications.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <input value={c.name} onChange={(e) => updateItem("certifications", i, "name", e.target.value)} placeholder="Certificate Name" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={c.issuer} onChange={(e) => updateItem("certifications", i, "issuer", e.target.value)} placeholder="Issuer" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <input value={c.year} onChange={(e) => updateItem("certifications", i, "year", e.target.value)} placeholder="Year" className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm" />
                  <button onClick={() => removeItem("certifications", i)} className="text-xs text-red-400">Remove</button>
                </div>
              ))}
              <button onClick={() => addItem("certifications", { name: "", issuer: "", year: "" })} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Certification</button>
            </div>
          )}

        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — LIVE PREVIEW
      ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#0b0f19]">
        <div ref={previewRef} className={`max-w-5xl mx-auto ${currentLayout.font}`}>

          {/* HERO */}
          {visible.hero && (
            <div className={`relative overflow-hidden ${currentLayout.rounded} border border-white/10 ${currentLayout.heroStyle} ${theme.bgGradient} p-10 ${currentLayout.sectionSpacing} backdrop-blur-xl`}>
              <div className="flex items-start gap-6">
                {portfolio.avatar && (
                  <img src={portfolio.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-white/20 object-cover" />
                )}
                <div className="flex-1">
                  <h1 className="text-5xl font-bold mb-2">{portfolio.name}</h1>
                  <h2 className={`text-2xl mb-4 ${accentText[theme.accent]}`}>{portfolio.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    {portfolio.email && <span>✉ {portfolio.email}</span>}
                    {portfolio.location && <span>📍 {portfolio.location}</span>}
                  </div>
                  <p className="text-gray-300 leading-relaxed max-w-2xl">{portfolio.bio}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {portfolio.social.github && <a href={portfolio.social.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">GitHub</a>}
                {portfolio.social.linkedin && <a href={portfolio.social.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">LinkedIn</a>}
                {portfolio.social.twitter && <a href={portfolio.social.twitter} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">Twitter</a>}
                {portfolio.social.website && <a href={portfolio.social.website} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">Website</a>}
              </div>
            </div>
          )}

          {/* STATS */}
          {visible.stats && (
            <div className={`grid grid-cols-2 ${currentLayout.statsGrid} gap-4 ${currentLayout.sectionSpacing}`}>
              {portfolio.stats.map((stat, i) => (
                <div key={i} className={`p-5 ${currentLayout.rounded} ${currentLayout.cardStyle} text-center`}>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {visible.skills && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {portfolio.skills.map((skill, i) => (
                  <span key={i} className={`px-4 py-2 rounded-full text-sm ${accentMap[theme.accent]}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {visible.projects && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Projects</h3>
              <div className={`grid ${currentLayout.projectGrid} gap-5`}>
                {portfolio.projects.map((project, i) => (
                  <div key={i} className={`p-6 ${currentLayout.rounded} ${currentLayout.cardStyle}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-semibold">{project.title}</h4>
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">View →</a>}
                    </div>
                    <p className="text-gray-400 mb-4">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.map((t, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {visible.experience && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Experience</h3>
              <div className="space-y-4">
                {portfolio.experience.map((exp, i) => (
                  <div key={i} className={`p-5 ${currentLayout.rounded} ${currentLayout.cardStyle} ${layout === "modern" ? `border-l-4 ${accentBorder[theme.accent]}` : ""}`}>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-semibold">{exp.role}</h4>
                      <span className="text-sm text-gray-400">{exp.period}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{exp.company}</div>
                    <p className="text-gray-300 text-sm">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {visible.education && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Education</h3>
              <div className="space-y-4">
                {portfolio.education.map((edu, i) => (
                  <div key={i} className={`p-5 ${currentLayout.rounded} ${currentLayout.cardStyle}`}>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <div className="text-sm text-gray-400">{edu.school} • {edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {visible.testimonials && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Testimonials</h3>
              <div className={`grid ${currentLayout.testimonialGrid} gap-5`}>
                {portfolio.testimonials.map((t, i) => (
                  <div key={i} className={`p-6 ${currentLayout.rounded} ${currentLayout.cardStyle} italic`}>
                    <p className="text-gray-300 mb-4">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center font-bold">{t.name[0]}</div>
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {visible.certifications && (
            <div className={currentLayout.sectionSpacing}>
              <h3 className="text-2xl font-semibold mb-5">Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {portfolio.certifications.map((c, i) => (
                  <div key={i} className={`px-5 py-3 ${currentLayout.rounded} ${currentLayout.cardStyle}`}>
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.issuer} • {c.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT FOOTER */}
          {visible.contact && (
            <div className={`p-8 ${currentLayout.rounded} ${currentLayout.cardStyle} text-center`}>
              <h3 className="text-xl font-semibold mb-2">Let's work together</h3>
              <p className="text-gray-400 mb-4">Open for freelance projects and collaborations.</p>
              <a href={`mailto:${portfolio.email}`} className={`inline-block px-6 py-3 rounded-lg font-semibold ${accentMap[theme.accent]}`}>
                Contact Me
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}