import User from "../models/user.js"; // Capitalized for clarity
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, contact, flatNumber, vehicleNo } = req.body;

  if (!name || !email || !password || !role || !contact) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create user using new User() to trigger pre-save hook
    const newUser = new User({
      name,
      email,
      password,
      role,
      contact,
      flatNumber: role === "resident" ? flatNumber : undefined,
      vehicleNo: role === "resident" ? vehicleNo : undefined,
    });

    await newUser.save(); // pre-save hook will hash the password

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      contact: newUser.contact,
      token: generateToken(newUser._id, newUser.role),
    });
  } catch (err) {
    console.error(err); // log the actual error
    res.status(500).json({ message: "Registration failed" });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser && (await oldUser.matchPassword(password))) {
      res.json({
        _id: oldUser._id,
        name: oldUser.name,
        email: oldUser.email,
        role: oldUser.role,
        token: generateToken(oldUser._id, oldUser.role)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
