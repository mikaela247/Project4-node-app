import express from "express";
import { getAllLogs, getLogsByItemId } from "../controllers/logController.js";

const router = express.Router();

router.get("/", getAllLogs);
router.get("/item/:itemId", getLogsByItemId);

export default router;
