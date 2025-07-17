export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  //Mongoose Validation error
  if (err.name == "ValidationError") {
    const error = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validatiion Errors",
      error,
    });
  }
  //Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists.`,
    });
  }
  //JWT errors
  if (err.name === "TokenExpiredError") {
    return res.status.json({
      success: false,
      message: "Token expired",
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status.json({
      success: false,
      message: "invalid Token",
    });
  }
  if (err.statusCode && (err.statusCode >= 400) & (err.statusCode < 500)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  //Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};
