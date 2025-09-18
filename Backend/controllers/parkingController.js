import Parking from "../models/Parking.js";

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


export const getMyParking = async (req, res) => {
  try {
    const requests = await Parking.find({ residentId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
