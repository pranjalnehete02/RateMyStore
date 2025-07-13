// middleware/roleCheck.js

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: `Access denied for role: ${req.user?.role}` });
    }
    next();
  };
};

module.exports = { checkRole };
