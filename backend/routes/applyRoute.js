import express from "express";
import multer from "multer";
import { applyJob } from "../controllers/applicationController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), applyJob);

export default router;