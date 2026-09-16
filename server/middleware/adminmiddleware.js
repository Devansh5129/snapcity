
const adminOnly = (req, res, next) => {

    // Check whether user is authenticated
    // and whether their role is admin

    if (!req.user || req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });

    }

    // User is an admin
    // Continue to the next middleware/controller

    next();
};

module.exports = adminOnly;