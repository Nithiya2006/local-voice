import express from "express";
import { toggleSupport, getMySupports } from "../controllers/supportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-supports", protect, getMySupports);
router.post("/:id", protect, toggleSupport);

export default router;
