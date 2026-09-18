const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);
// ==========================================
// ENVIRONMENT VALIDATION
// ==========================================

if (!process.env.MONGO_URI) {

    console.error(
        "ERROR: MONGO_URI is missing from .env"
    );

    process.exit(1);
}

if (!process.env.JWT_SECRET) {

    console.error(
        "ERROR: JWT_SECRET is missing from .env"
    );

    process.exit(1);
}


const placeRoutes = require("./routes/placeRoutes");
const authRoutes = require("./routes/authRoutes");



// ==========================================
// SECURITY
// ==========================================

app.use(helmet());


// ==========================================
// CORS
// ==========================================

// Development:
// Allowing localhost makes local frontend development
// work normally.
//
// Later, when SnapCity is deployed, we will replace
// this with the real frontend URL.

const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://snapcity-lx28.onrender.com"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests such as Postman/cURL that
            // don't send an Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("CORS policy blocked this origin")
            );
        }
    })
);


// ==========================================
// REQUEST BODY LIMIT
// ==========================================

app.use(
    express.json({
        limit: "100kb"
    })
);


// ==========================================
// GENERAL RATE LIMIT
// ==========================================

const generalLimiter =
    rateLimit({
        windowMs: 15 * 60 * 1000,

        max: 300,

        standardHeaders: true,

        legacyHeaders: false,

        message: {
            message:
                "Too many requests. Please try again later."
        }
    });

app.use(generalLimiter);


// ==========================================
// BASIC API CHECK
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "SnapCity API is running"
    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/places",
    placeRoutes
);

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    function (error, req, res, next) {

        console.error(
            "Server error:",
            error.message
        );

        if (
            error.message ===
            "CORS policy blocked this origin"
        ) {

            return res.status(403).json({
                message:
                    "Request blocked by CORS policy"
            });
        }

        return res.status(500).json({
            message:
                "Internal server error"
        });

    }
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

// ==========================================
// MONGODB + SERVER STARTUP
// ==========================================


const PORT = process.env.PORT || 5000;


mongoose.connect(
    process.env.MONGO_URI
)
.then(function () {

    console.log(
        "MongoDB connected successfully"
    );

    app.listen(
        PORT,
        function () {

            console.log(
                `SnapCity server running on http://localhost:${PORT}`
            );

        }
    );

})
.catch(function (error) {

    console.error(
        "MongoDB connection failed."
    );

    console.error(
        error.message
    );

    process.exit(1);

});
