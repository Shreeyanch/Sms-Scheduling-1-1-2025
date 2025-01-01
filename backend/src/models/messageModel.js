import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    message: { type: String, required: true, maxlength: 30 },

    dateandtime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
