// server/middleware/roleMiddleware.js

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }

    next(); // User has required role → proceed
  };
};

module.exports = allowRoles;
