import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Output from "./models/Output.js";
import User from "./models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connected"))
  .catch((err) => console.log("🔴 MongoDB error:", err));

const app = express();
app.use(cors());
app.use(express.json());

/* -----------------------------
   GROQ CLIENT (OpenAI compatible)
------------------------------ */
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

/* -----------------------------
   AUTH ROUTES
------------------------------ */
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();

    res.json({ success: true, user: { name, email } });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

/* -----------------------------
   AI GENERATION ROUTE
------------------------------ */
app.post("/api/generate", async (req, res) => {
  try {
    const { profile, projects } = req.body;
    if (!profile || !projects) {
      return res.status(400).json({ error: "Missing data" });
    }

    const prompt = `You are a professional portfolio generator AI.

User:
Name: ${profile.name}
Title: ${profile.title}
Bio: ${profile.bio}

Projects:
${projects.map((p) => `- ${p.title}: ${p.desc}`).join("\n")}

Return ONLY valid JSON:
{
  "bio": "...",
  "summary": "...",
  "projects": [{ "title": "...", "desc": "..." }]
}
`;

    let lastError = null;

    for (const model of MODELS) {
      try {
        const response = await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });

        let text = response.choices[0].message.content;
        text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

        return res.json({
          ...JSON.parse(text),
          provider: "groq",
          modelUsed: model,
        });
      } catch (err) {
        if (err.message?.includes("decommissioned") || err.status === 400) {
          console.warn(`Model ${model} dead, trying next...`);
          lastError = err;
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error("All models unavailable");
  } catch (err) {
    console.error("🔥 BACKEND ERROR:", err);
    res.status(500).json({
      error: "AI generation failed",
      details: err.message,
    });
  }
});

/* -----------------------------
   SAVE AI OUTPUT
------------------------------ */
app.post("/api/save-output", async (req, res) => {
  try {
    const saved = await Output.create(req.body);
    res.json({ success: true, saved });
  } catch (err) {
    res.status(500).json({
      error: "Failed to save output",
      details: err.message,
    });
  }
});

/* -----------------------------
   GET SAVED OUTPUTS
------------------------------ */
app.get("/api/outputs", async (req, res) => {
  try {
    const outputs = await Output.find().sort({ createdAt: -1 });
    res.json(outputs);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch outputs",
      details: err.message,
    });
  }
});

/* -----------------------------
   SERVER START
------------------------------ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});