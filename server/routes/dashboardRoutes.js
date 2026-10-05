import express from "express";
import { getDashboardStats } from "../controllers/issueController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);

export default router;
