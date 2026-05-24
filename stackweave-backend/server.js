import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq client (OpenAI-compatible)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/generate", async (req, res) => {
  try {
    const { profile, projects } = req.body;

    if (!profile || !projects) {
      return res.status(400).json({ error: "Missing profile or projects" });
    }

    const prompt = `You are a professional portfolio generator AI.

User:
Name: ${profile.name || "Unknown"}
Title: ${profile.title || "Developer"}
Bio: ${profile.bio || ""}

Projects:
${projects.map(p => `- ${p.title || "Project"}: ${p.desc || ""}`).join("\n")}

Return ONLY valid JSON without markdown backticks:
{
  "bio": "improved bio here",
  "summary": "professional summary here",
  "projects": [
    { "title": "...", "desc": "..." }
  ]
}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // ← FIXED
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let text = response.choices[0].message.content;
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const parsed = JSON.parse(text);

    res.json({
      ...parsed,
      provider: "groq",
    });

  } catch (err) {
    console.error("🔥 BACKEND ERROR:", err);
    res.status(500).json({
      error: "AI generation failed",
      details: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});