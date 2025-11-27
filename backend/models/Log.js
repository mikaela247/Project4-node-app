import mongoose, { Schema } from "mongoose";

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, "Please choose action (add, update, delete)"],
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changes: {
    type: Object,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
