import express from "express";
import {
  getItems,
  getItemsById,
  addNewItem,
  updateItemById,
  softDeleteItemById,
} from "../controllers/itemControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getItems", getItems);
router.get("/getItems/:id", getItemsById);
router.post("/addNewItem", protect, addNewItem);
router.patch("/updateItem/:id", protect, updateItemById);
router.patch("/softDelete/:id", protect, softDeleteItemById);

export default router;
