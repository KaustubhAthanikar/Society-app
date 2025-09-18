import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date } // optional (e.g. maintenance shutdown notice)
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
