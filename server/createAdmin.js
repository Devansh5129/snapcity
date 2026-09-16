const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const adminEmail = "admin@snapcity.com";
        const adminPassword = "Admin@123";

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {

            console.log("Admin already exists");

            await mongoose.disconnect();

            return;
        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        // Create admin
        const admin = new User({
            name: "SnapCity Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        await admin.save();

        console.log("Admin created successfully");

        await mongoose.disconnect();

    } catch (error) {

        console.error("Error creating admin:", error);

        await mongoose.disconnect();

    }

};

createAdmin();