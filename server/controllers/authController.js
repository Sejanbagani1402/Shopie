import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Try other email or username.",
      });
    }
    const user = new User({ username, email, password });
    await user.save();
    // Return response without password
    const userResponse = user.toObject();
    delete userResponse.password;
    //
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    //Registration comleted.
    res.status(201).json({
      success: true,
      message: "Registration Completed!",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Registration failed due to ${error.message}.`,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User didn't exists in our system." });
    }
    if (!user.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Account is deactivated." });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });
    user.refreshToken = refreshToken;
    await user.save();

    //Login Successful
    res.json({
      success: true,
      message: "Login Successful.",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    const accessToken = generateAccessToken({
      user: user._id,
      email: user.email,
      role: user.role,
    });
    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
