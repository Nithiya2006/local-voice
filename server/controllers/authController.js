import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "localvoice_jwt_super_secret_key_2026_community_civic_platform",
    {
      expiresIn: "30d"
    }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, phone, password, city, area } = req.body;

    const userName = (name || fullName || "").trim();
    const userEmail = (email || "").toLowerCase().trim();
    const userCity = (city || area || "Central Metro Civic Zone").trim();

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name."
      });
    }

    if (!userEmail || !userEmail.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: userEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please login instead."
      });
    }

    // Create user
    const user = await User.create({
      name: userName,
      email: userEmail,
      phone: phone || "",
      password,
      city: userCity,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        area: user.city,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed due to a server error."
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userEmail = (email || "").toLowerCase().trim();

    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email address and password."
      });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please verify your credentials."
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please verify your credentials."
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        area: user.city,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed due to a server error."
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        area: user.city,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user profile."
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const { name, fullName, phone, city, area, avatar, currentPassword, newPassword } = req.body;

    if (name || fullName) user.name = (name || fullName).trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (city || area) user.city = (city || area).trim();
    if (avatar) user.avatar = avatar.trim();

    // Password update if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set a new password."
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password entered is incorrect."
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters."
        });
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        area: updatedUser.city,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile."
    });
  }
};
