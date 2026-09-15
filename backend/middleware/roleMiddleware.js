const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Logged in role:", req.user.role);
    console.log("Allowed roles:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
};

module.exports = authorize;