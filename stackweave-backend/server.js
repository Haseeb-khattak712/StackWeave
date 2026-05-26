import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
   JWT & AUTH HELPERS
------------------------------ */
const JWT_SECRET = process.env.JWT_SECRET || "stackweave_dev_secret_change_in_production";

// Generate token helper
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* -----------------------------
   AUTH ROUTES (updated with tokens)
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

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
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

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
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
   PROTECTED SAVE OUTPUT ROUTE
------------------------------ */
app.post("/api/save-output", authenticate, async (req, res) => {
  try {
    const { profile, projects, generatedContent, modelUsed } = req.body;

    const saved = await Output.create({
      userId: req.user.id,
      profile,
      projects,
      generatedContent,
      modelUsed,
    });

    res.json({ success: true, saved });
  } catch (err) {
    console.error("🔥 SAVE OUTPUT ERROR:", err);
    res.status(500).json({ error: "Failed to save output", details: err.message });
  }
});

/* -----------------------------
   GET USER'S OUTPUTS (protected)
------------------------------ */
app.get("/api/outputs", authenticate, async (req, res) => {
  try {
    const outputs = await Output.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(outputs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch outputs", details: err.message });
  }
});

/* -----------------------------
   SERVER START
------------------------------ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});