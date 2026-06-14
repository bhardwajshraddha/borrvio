const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, city, area, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      area,
      phone,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      area: user.area,
      trustScore: user.trustScore,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      area: user.area,
      phone: user.phone,
      trustScore: user.trustScore,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, area } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, city, area },
      { new: true },
    ).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crypto = require("crypto");

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email!" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Save to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const resend = require("../config/emailConfig");
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Borrvio — Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Borrvio Password Reset</h2>

      <p>Hi <b>${user.name}</b>,</p>

      <p>You requested to reset your password. Click the button below:</p>

      <a href="${resetLink}"
         style="background:#f97316;color:white;padding:12px 24px;
         border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
        Reset Password
      </a>

      <p style="color:#888;">
        This link expires in <b>30 minutes</b>.
      </p>

      <p style="color:#888;">
        If you did not request this, ignore this email.
      </p>

      <br/>
      <p>Team Borrvio 🚀</p>
    </div>
  `,
    });

    res
      .status(200)
      .json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset link!" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successfully! Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};
