import express from "express";
import {
  requestParking,
  getMyParking,
  getPendingParking,
  updateParkingStatus
} from "../controllers/parkingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resident requests parking
router.post("/", protect, requestParking);

// Resident views own parking requests
router.get("/my", protect, getMyParking);

// Admin views pending requests
router.get("/pending", protect, adminOnly, getPendingParking);

// Admin approves/rejects a request
router.put("/:id", protect, adminOnly, updateParkingStatus);

export default router;
