import express from "express";
import { createNotice, getNotices, deleteNotice } from "../controllers/noticeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin creates notice
router.post("/", protect, adminOnly, createNotice);

// All users can fetch active notices
router.get("/", protect, getNotices);

// Admin deletes notice
router.delete("/:id", protect, adminOnly, deleteNotice);

export default router;
