import Complaint from "../models/Complaints.js";

// Resident: Add complaint
export const addComplaint = async (req, res) => {
  try {
    const complaint = new Complaint({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Error adding complaint" });
  }
};

// Resident: Get my complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Admin: Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Admin: Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = req.body.status; // "in progress" or "resolved"
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Error updating complaint" });
  }
};
