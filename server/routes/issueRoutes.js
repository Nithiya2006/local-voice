import express from "express";
import {
  createIssue,
  getIssues,
  getNearbyIssues,
  getMyReports,
  getIssueById,
  updateIssue,
  deleteIssue
} from "../controllers/issueController.js";
import { toggleSupport } from "../controllers/supportController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { handleImageUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getIssues)
  .post(protect, handleImageUpload, createIssue);

router.get("/nearby", getNearbyIssues);
router.get("/my-reports", protect, getMyReports);

router.route("/:id")
  .get(optionalAuth, getIssueById)
  .put(protect, updateIssue)
  .delete(protect, deleteIssue);

router.post("/:id/support", protect, toggleSupport);

export default router;
