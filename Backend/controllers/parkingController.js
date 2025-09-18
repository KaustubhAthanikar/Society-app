import Parking from "../models/Parking.js";

// @desc Resident requests a parking slot
// @route POST /api/parking
// @access Private (resident)
export const requestParking = async (req, res) => {
  try {
    const { slotNumber } = req.body;

    const parkingRequest = await Parking.create({
      residentId: req.user._id,
      slotNumber,
      requestStatus: "pending",
    });

    res.status(201).json(parkingRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resident views own parking requests
// @route GET /api/parking/my
// @access Private (resident)
export const getMyParking = async (req, res) => {
  try {
    const requests = await Parking.find({ residentId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin views all pending parking requests
// @route GET /api/parking/pending
// @access Private (admin)
export const getPendingParking = async (req, res) => {
  try {
    const requests = await Parking.find({ requestStatus: "pending" })
      .populate("residentId", "name flatNumber contact")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin approves or rejects a parking request
// @route PUT /api/parking/:id
// @access Private (admin)
export const updateParkingStatus = async (req, res) => {
  try {
    const { requestStatus, slotNumber } = req.body; // approve/reject & optional slotNumber
    const request = await Parking.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.requestStatus = requestStatus || request.requestStatus;
    if (slotNumber) request.slotNumber = slotNumber;
    request.approvedBy = req.user._id;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
