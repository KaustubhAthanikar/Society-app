import express from "express";
import {
  createMaintenance,
  getAllMaintenance,
  getMyMaintenance,
  payMaintenance,
  updateMaintenance
} from "../controllers/maintenanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin creates a maintenance bill
router.post("/", protect, adminOnly, createMaintenance);

// Admin fetches all maintenance bills
router.get("/", protect, adminOnly, getAllMaintenance);

router.put("/:id", protect, adminOnly, updateMaintenance);

// Resident fetches own bills
router.get("/my", protect, getMyMaintenance);

// Resident marks bill as paid
router.put("/:id/pay", protect, payMaintenance);

export default router;
