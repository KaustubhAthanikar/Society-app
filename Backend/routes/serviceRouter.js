import express from "express";
import { addServiceProvider, getServiceProviders, deleteServiceProvider } from "../controllers/serviceProviderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin adds provider
router.post("/", protect, adminOnly, addServiceProvider);

// All users can fetch providers
router.get("/", protect, getServiceProviders);

// Admin deletes provider
router.delete("/:id", protect, adminOnly, deleteServiceProvider);

export default router;
