import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  addComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

// Residents
router.post("/", protect, addComplaint);
router.get("/my", protect, getMyComplaints);

// Admin
router.get("/all", protect, adminOnly, getAllComplaints);
router.put("/:id/status", protect, adminOnly, updateComplaintStatus);

export default router;
