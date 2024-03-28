
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");


exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(500).json({
            success: false,
            message: "Login first to access this resource",
        });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findOne({ uid: decodedData.id }).exec();

    next();
};

// Admin Roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(500).json({
                success: false,
                message: `${req.user.role} can not access this resources`
            }
            );
        }
        next();
    }
}