const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided.",
      });
    }

    token = token.split(" ")[1];

    console.log("Received Token:", token);

    const decoded = jwt.verify(token, "mysecretkey");

    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};

module.exports = protect;