import Visitor from "../models/Visitor.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Resident creates a visitor request (generates QR data)
export const createVisitor = async (req, res) => {
  try {
    const { name, contact, purpose, vehicleNo, validTill } = req.body;

    const residentId = req.user._id;
    const resident = await User.findById(residentId);

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const newVisitor = await Visitor.create({
      name,
      contact,
      purpose,
      vehicleNo,
      validTill,
      residentId,
      flatNo: resident.flatNumber, // auto-fill flatNo
      residentName: resident.name,
      status: "pending",
      logs: [
        {
          guardId: residentId, // treat resident as actor for creation
          action: "created",
          note: "Visitor created by resident"
        }
      ]
    });

    // QR Data (encode visitorId)
    const qrPayload = { visitorId: newVisitor._id };
    const qrToken = jwt.sign(qrPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "Visitor created successfully",
      visitor: newVisitor,
      qrCode: qrToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Guard scans QR and verifies visitor
export const verifyVisitor = async (req, res) => {
  try {
    const { qrCode } = req.body;
    const decoded = jwt.verify(qrCode, process.env.JWT_SECRET);
    const visitor = await Visitor.findById(decoded.visitorId);

    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    // Mark visitor as "checked-in"
    visitor.status = "checked-in";
    visitor.checkInTime = new Date();

    // Add guard log
    visitor.logs.push({
      guardId: req.user._id,
      action: "checked-in",
      note: "Visitor verified and checked-in by guard"
    });

    await visitor.save();

    res.json({ message: "Visitor verified and checked-in", visitor });

  } catch (error) {
    res.status(400).json({ message: "Invalid or expired QR code" });
  }
};

// Guard fetches all pending visitor requests
export const getPendingVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ status: "pending" })
      .populate("residentId", "name flatNumber contact");
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate("residentId", "name flatNumber");
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
