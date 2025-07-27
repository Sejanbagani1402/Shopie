import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token", error: error.message });
  }
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions. Admin access required",
      });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
    next();
  };
};
