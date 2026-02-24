import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { 
    type: String, 
    enum: ["pending", "matched"], 
    default: "pending" 
  },
  swipedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who initiated the swipe
  swipedOn: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who was swiped on
  createdAt: { type: Date, default: Date.now }
});

// Ensure we don't have duplicate entries for the same pair in the same direction
matchSchema.index({ swipedBy: 1, swipedOn: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);
