import Maintenance from "../models/Maintenance.js";

// @desc Create a new maintenance bill (Admin)
// @route POST /api/maintenance
// @access Private (admin)
export const createMaintenance = async (req, res) => {
  try {
    const { residentId, month, amount, dueDate } = req.body;
    if (!residentId || !month || !amount) {
      return res.status(400).json({ message: "Resident, month and amount are required" });
    }

    const maintenance = await Maintenance.create({
      residentId,
      month,
      amount,
      dueDate,
    });

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all maintenance bills (Admin)
// @route GET /api/maintenance
// @access Private (admin)
export const getAllMaintenance = async (req, res) => {
  try {
    const bills = await Maintenance.find()
      .populate("residentId", "name flatNumber contact")
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get maintenance bills of logged-in resident
// @route GET /api/maintenance/my
// @access Private (resident)
export const getMyMaintenance = async (req, res) => {
  try {
    const bills = await Maintenance.find({ residentId: req.user._id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark bill as paid (Resident)
// @route PUT /api/maintenance/:id/pay
// @access Private (resident)
export const payMaintenance = async (req, res) => {
  try {
    const bill = await Maintenance.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "paid";
    bill.paymentDate = new Date();
    bill.receiptUrl = req.body.receiptUrl; // optional

    await bill.save();
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a maintenance bill (Admin)
// @route PUT /api/maintenance/:id
// @access Private (admin)
export const updateMaintenance = async (req, res) => {
  try {
    const bill = await Maintenance.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    const { residentId, month, amount, dueDate, status } = req.body;

    if (residentId) bill.residentId = residentId;
    if (month) bill.month = month;
    if (amount) bill.amount = amount;
    if (dueDate) bill.dueDate = dueDate;
    if (status && ["paid", "unpaid"].includes(status)) bill.status = status;

    await bill.save();
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

