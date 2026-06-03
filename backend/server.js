import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import applyRoute from "./routes/applyRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// routes
app.use("/api/apply", applyRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});