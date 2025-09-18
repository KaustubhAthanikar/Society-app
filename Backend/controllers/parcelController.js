import Parcel from "../models/Parcel.js";

// @desc Guard logs a new parcel
// @route POST /api/parcels
// @access Private (guard)
export const createParcel = async (req, res) => {
  try {
    const { residentId, parcelDetails } = req.body;

    if (!residentId || !parcelDetails) {
      return res.status(400).json({ message: "Resident and parcel details are required" });
    }

    const parcel = await Parcel.create({
      residentId,
      parcelDetails,
      receivedBy: req.user._id,
      status: "pending"
    });

    res.status(201).json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resident views their parcels
// @route GET /api/parcels/my
// @access Private (resident)
export const getMyParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ residentId: req.user._id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resident marks parcel as collected
// @route PUT /api/parcels/:id/collect
// @access Private (resident)
export const collectParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });

    if (!parcel.residentId.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only collect your own parcels" });
    }

    parcel.status = "collected";
    await parcel.save();

    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Guard views all pending parcels
// @route GET /api/parcels/pending
// @access Private (guard)
export const getPendingParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ status: "pending" })
      .populate("residentId", "name flatNumber contact")
      .sort({ createdAt: -1 });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
