import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);
