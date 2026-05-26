import mongoose from "mongoose";

const OutputSchema = new mongoose.Schema({
  profile: Object,
  result: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Output = mongoose.model("Output", OutputSchema);

export default Output;
