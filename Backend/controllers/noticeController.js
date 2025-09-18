import Notice from "../models/Notice.js";

// @desc Create a new notice (Admin)
// @route POST /api/notices
// @access Private (admin)
export const createNotice = async (req, res) => {
  try {
    const { title, message, expiryDate } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notice = await Notice.create({
      title,
      message,
      expiryDate,
      createdBy: req.user._id,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all active notices
// @route GET /api/notices
// @access Private (all users)
export const getNotices = async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a notice (Admin)
// @route DELETE /api/notices/:id
// @access Private (admin)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    await notice.remove();
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
