
// ==========================================
// SNAPCITY AUTH CONTROLLER
// ==========================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // --------------------------------------
        // BASIC VALIDATION
        // --------------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }


        // --------------------------------------
        // NAME VALIDATION
        // --------------------------------------

        const cleanName =
            String(name).trim();

        if (cleanName.length < 2) {

            return res.status(400).json({
                success: false,
                message:
                    "Name must contain at least 2 characters"
            });
        }

        if (cleanName.length > 80) {

            return res.status(400).json({
                success: false,
                message:
                    "Name is too long"
            });
        }


        // --------------------------------------
        // EMAIL VALIDATION
        // --------------------------------------

        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid email address"
            });
        }


        // --------------------------------------
        // PASSWORD VALIDATION
        // --------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters"
            });
        }

        if (password.length > 100) {

            return res.status(400).json({
                success: false,
                message:
                    "Password is too long"
            });
        }


        // --------------------------------------
        // CHECK EXISTING USER
        // --------------------------------------

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "User already exists"
            });
        }


        // --------------------------------------
        // HASH PASSWORD
        // --------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // --------------------------------------
        // CREATE USER
        // --------------------------------------

        const user =
            new User({
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword
            });


        const savedUser =
            await user.save();


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            data: {

                id: savedUser._id,

                name: savedUser.name,

                email: savedUser.email
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Registration failed"
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // --------------------------------------
        // BASIC VALIDATION
        // --------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"
            });
        }


        // --------------------------------------
        // EMAIL VALIDATION
        // --------------------------------------

        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid email address"
            });
        }


        // --------------------------------------
        // FIND USER
        // --------------------------------------

        const user =
            await User.findOne({
                email: cleanEmail
            });


        // --------------------------------------
        // INVALID USER
        // --------------------------------------

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"
            });
        }


        // --------------------------------------
        // CHECK PASSWORD
        // --------------------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"
            });
        }


        // --------------------------------------
        // CREATE JWT
        // --------------------------------------

        const token =
            jwt.sign(

                {
                    userId: user._id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }
            );


        // --------------------------------------
        // SUCCESS RESPONSE
        // --------------------------------------

        return res.json({

            success: true,

            message:
                "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Login failed"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    registerUser,
    loginUser
};
