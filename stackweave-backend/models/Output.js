import mongoose from "mongoose";

const outputSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  profile: {
    name: String,
    title: String,
    bio: String,
  },
  projects: [{
    title: String,
    desc: String,
    tech: [String],
    link: String,
  }],
  generatedContent: {
    bio: String,
    summary: String,
    projects: [{
      title: String,
      desc: String,
    }],
  },
  modelUsed: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'portfolios' });  // ← ADD THIS

export default mongoose.model("Output", outputSchema);