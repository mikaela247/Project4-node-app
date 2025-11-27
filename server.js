import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./database/connectDB.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/api/items", itemRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/users", authRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
