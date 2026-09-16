
const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const router = express.Router();


// ==========================================
// AUTH RATE LIMITER
// ==========================================
//
// Authentication endpoints should have a stricter
// limit than normal public API requests.
//
// This helps reduce repeated login/register attempts.
//

const authLimiter = rateLimit({

    // 15 minute window
    windowMs: 15 * 60 * 1000,

    // Maximum 20 authentication requests
    // from the same IP during the window.
    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        message:
            "Too many authentication attempts. Please try again later."
    }

});


// ==========================================
// AUTH ROUTES
// ==========================================

router.post(
    "/register",
    authLimiter,
    registerUser
);

router.post(
    "/login",
    authLimiter,
    loginUser
);


module.exports = router;
