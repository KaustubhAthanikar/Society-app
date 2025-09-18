import ServiceProvider from "../models/ServiceProvider.js";

// @desc Admin adds a service provider
// @route POST /api/service-providers
// @access Private (admin)
export const addServiceProvider = async (req, res) => {
  try {
    const { name, contact, category } = req.body;
    if (!name || !contact || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const provider = await ServiceProvider.create({
      name,
      contact,
      category,
      addedBy: req.user._id,
    });

    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all service providers
// @route GET /api/service-providers
// @access Private (all users)
export const getServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin deletes a service provider
// @route DELETE /api/service-providers/:id
// @access Private (admin)
export const deleteServiceProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    await provider.remove();
    res.json({ message: "Service provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
