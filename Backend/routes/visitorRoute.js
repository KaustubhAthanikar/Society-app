import express from "express";
import { createVisitor, verifyVisitor, getPendingVisitors } from "../controllers/visitorController.js";
import { protect, guardOnly, adminOnly } from "../middleware/authMiddleware.js";
import { getAllVisitors } from "../controllers/visitorController.js";

const router = express.Router();

// Resident creates visitor (QR generated)
router.post("/create", protect, createVisitor);

// Guard scans and verifies visitor
router.post("/verify", protect, guardOnly, verifyVisitor);

// Guard fetches pending visitor requests
router.get("/pending", protect, guardOnly, getPendingVisitors);

router.get("/all", protect, adminOnly, getAllVisitors);


export default router;
