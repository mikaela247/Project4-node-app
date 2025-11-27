import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name required"],
      unique: true,
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is needed"],
    },
    unit: {
      type: String,
      required: [true, "Item unit is needed"],
    },
    category: {
      type: String,
      required: [true, "Item category is needed"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Item = mongoose.model("Item", itemSchema);

export default Item;
