import express from "express";
import {
  createParcel,
  getMyParcels,
  collectParcel,
  getPendingParcels
} from "../controllers/parcelController.js";
import { protect, guardOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guard logs a parcel
router.post("/", protect, guardOnly, createParcel);

// Guard views pending parcels
router.get("/pending", protect, guardOnly, getPendingParcels);

// Resident views their parcels
router.get("/my", protect, getMyParcels);

// Resident collects a parcel
router.put("/:id/collect", protect, collectParcel);

export default router;
