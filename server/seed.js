
const mongoose = require("mongoose");
require("dotenv").config();

const Place = require("./models/placeModel");


// ======================================================
// SNAPCITY — 100 DEMO PLACES
// ======================================================
//
// 50 Indore
// 50 Bhopal
//
// These are DEMO records for development/testing.
// They are not claims about real businesses.
//
// Categories per city:
// 10 Hostels / PG
// 10 Mess / Tiffin
// 10 Restaurants
// 10 Hospitals
// 5 Clinics
// 5 Temples
//
// TOTAL = 100
// ======================================================


// ======================================================
// IMAGE COLLECTION
// ======================================================

const images = {

    hostel:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",

    mess:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",

    restaurant:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",

    hospital:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",

    clinic:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",

    temple:
        "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80"
};


// ======================================================
// CITY INFORMATION
// ======================================================

const cityInfo = {

    Indore: {
        areas: [
            "Vijay Nagar",
            "Bhawarkua",
            "Palasia",
            "Rau",
            "Scheme No. 54",
            "Geeta Bhawan",
            "New Palasia",
            "South Tukoganj",
            "LIG Colony",
            "Bengali Square"
        ],

        latitude: 22.7196,
        longitude: 75.8577
    },

    Bhopal: {
        areas: [
            "MP Nagar",
            "Arera Colony",
            "Kolar Road",
            "Shahpura",
            "Ayodhya Nagar",
            "Bawadiya Kalan",
            "BHEL",
            "Lalghati",
            "Berkheda",
            "Habibganj"
        ],

        latitude: 23.2599,
        longitude: 77.4126
    }
};


// ======================================================
// 10 HOSTELS / PG — EACH CITY
// ======================================================

const hostelNames = {

    Indore: [
        "Sunrise Boys Hostel",
        "Green View PG",
        "City Comfort PG",
        "Royal Residency PG",
        "Student Stay Indore",
        "Urban Nest Hostel",
        "Campus View PG",
        "Elite Student Residency",
        "Comfort Stay Hostel",
        "New City Boys PG"
    ],

    Bhopal: [
        "Lake View Boys Hostel",
        "Bhopal Student Residency",
        "Green Valley PG",
        "Capital City PG",
        "Student Corner Hostel",
        "Urban Stay Bhopal",
        "Campus Comfort PG",
        "Lake City Residency",
        "Bhopal Boys Hostel",
        "Smart City PG"
    ]
};


// ======================================================
// 10 MESS / TIFFIN — EACH CITY
// ======================================================

const messNames = {

    Indore: [
        "Maa Annapurna Mess",
        "Healthy Tiffin Service",
        "Student Food Corner",
        "Indore Home Mess",
        "Daily Fresh Tiffin",
        "Apna Student Mess",
        "Ghar Jaisa Tiffin",
        "Campus Meal Service",
        "Fresh Plate Mess",
        "Budget Tiffin Point"
    ],

    Bhopal: [
        "Bhopal Home Mess",
        "Fresh Tiffin Bhopal",
        "Student Rasoi",
        "Capital Tiffin Service",
        "Daily Meal Bhopal",
        "Apna Tiffin Center",
        "Ghar Jaisa Mess",
        "Lake City Tiffin",
        "Student Meal Point",
        "Budget Mess Bhopal"
    ]
};


// ======================================================
// 10 RESTAURANTS — EACH CITY
// ======================================================

const restaurantNames = {

    Indore: [
        "Urban Spice Restaurant",
        "Food Street Cafe",
        "Downtown Pizza House",
        "The Food Junction",
        "Indore Food Hub",
        "City Bite Restaurant",
        "Royal Taste Cafe",
        "Campus Cafe Indore",
        "Central Kitchen",
        "Food Avenue"
    ],

    Bhopal: [
        "Capital Spice Restaurant",
        "Lake City Cafe",
        "Bhopal Pizza Corner",
        "Urban Food Hub",
        "City Taste Restaurant",
        "Bhopal Food Avenue",
        "Royal Kitchen Bhopal",
        "Campus Cafe Bhopal",
        "Central Food House",
        "Lake View Restaurant"
    ]
};


// ======================================================
// 10 HOSPITALS — EACH CITY
// ======================================================

const hospitalNames = {

    Indore: [
        "City Care Hospital",
        "Metro Health Hospital",
        "LifeLine Medical Center",
        "Central Care Hospital",
        "Indore City Medical Center",
        "Urban Health Hospital",
        "Vijay Nagar Medical Center",
        "Prime Care Hospital",
        "Community Health Hospital",
        "City Life Hospital"
    ],

    Bhopal: [
        "Bhopal City Hospital",
        "Central Care Hospital",
        "Lake City Medical Center",
        "Capital Health Hospital",
        "Bhopal Medical Center",
        "Urban Care Hospital",
        "Smart City Hospital",
        "Community Medical Center",
        "Prime Health Hospital",
        "City Life Medical Center"
    ]
};


// ======================================================
// 5 CLINICS — EACH CITY
// ======================================================

const clinicNames = {

    Indore: [
        "City Dental Clinic",
        "Healthy Life Clinic",
        "Family Care Clinic",
        "Urban Medical Clinic",
        "Student Health Clinic"
    ],

    Bhopal: [
        "Capital Dental Clinic",
        "Bhopal Family Clinic",
        "Healthy Care Clinic",
        "Urban Health Clinic",
        "Lake City Medical Clinic"
    ]
};


// ======================================================
// 5 TEMPLES — EACH CITY
// ======================================================

const templeNames = {

    Indore: [
        "Shri Ganesh Temple",
        "Peaceful Shiva Temple",
        "Hanuman Mandir",
        "Shri Ram Temple",
        "City Hanuman Temple"
    ],

    Bhopal: [
        "Shri Ganesh Mandir Bhopal",
        "Bhopal Shiva Temple",
        "Hanuman Mandir Bhopal",
        "Shri Ram Mandir Bhopal",
        "Capital City Temple"
    ]
};


// ======================================================
// FACILITIES
// ======================================================

const facilities = {

    hostel: [
        "WiFi",
        "Food",
        "Laundry",
        "CCTV",
        "Parking"
    ],

    mess: [
        "Lunch",
        "Dinner",
        "Home Delivery",
        "Monthly Plans"
    ],

    restaurant: [
        "Dine In",
        "Takeaway",
        "Delivery",
        "Family Seating"
    ],

    hospital: [
        "Emergency",
        "Pharmacy",
        "Diagnostics",
        "Ambulance"
    ],

    clinic: [
        "Consultation",
        "Health Checkup",
        "Appointment"
    ],

    temple: [
        "Parking",
        "Drinking Water",
        "Prayer Area"
    ]
};


// ======================================================
// CATEGORY CONFIGURATION
// ======================================================

const categoryConfig = {

    hostel: {
        priceMin: 6000,
        priceMax: 12000,
        ratingMin: 4.0,
        ratingMax: 4.8
    },

    mess: {
        priceMin: 1800,
        priceMax: 3000,
        ratingMin: 4.0,
        ratingMax: 4.7
    },

    restaurant: {
        priceMin: 300,
        priceMax: 1000,
        ratingMin: 4.0,
        ratingMax: 4.8
    },

    hospital: {
        priceMin: 800,
        priceMax: 2000,
        ratingMin: 4.0,
        ratingMax: 4.7
    },

    clinic: {
        priceMin: 300,
        priceMax: 800,
        ratingMin: 4.0,
        ratingMax: 4.8
    },

    temple: {
        priceMin: 0,
        priceMax: 0,
        ratingMin: 4.2,
        ratingMax: 4.9
    }
};


// ======================================================
// RANDOM NUMBER HELPER
// ======================================================

function randomBetween(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ======================================================
// RATING HELPER
// ======================================================

function generateRating(min, max) {

    const rating =
        min + Math.random() * (max - min);

    return Number(
        rating.toFixed(1)
    );
}


// ======================================================
// PHONE NUMBER
// ======================================================
//
// These are clearly DEMO phone numbers.
// Do not treat them as real business contacts.
// ======================================================

let phoneCounter = 9000000001;

function generateDemoPhone() {

    const phone =
        String(phoneCounter);

    phoneCounter++;

    return phone;
}


// ======================================================
// PLACE CREATOR
// ======================================================

function createPlace(
    name,
    category,
    city,
    index
) {

    const info =
        cityInfo[city];

    const config =
        categoryConfig[category];

    const area =
        info.areas[
            index % info.areas.length
        ];

    const latitude =
        Number(
            (
                info.latitude +
                ((index % 5) * 0.001)
            ).toFixed(6)
        );

    const longitude =
        Number(
            (
                info.longitude +
                ((index % 5) * 0.001)
            ).toFixed(6)
        );

    let description = "";

    if (category === "hostel") {

        description =
            `Demo hostel/PG accommodation in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }

    else if (category === "mess") {

        description =
            `Demo mess and tiffin service in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }

    else if (category === "restaurant") {

        description =
            `Demo restaurant listing in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }

    else if (category === "hospital") {

        description =
            `Demo hospital listing in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }

    else if (category === "clinic") {

        description =
            `Demo clinic listing in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }

    else if (category === "temple") {

        description =
            `Demo temple listing in ${area}, ${city}. This record is sample data for SnapCity development.`;

    }


    return {

        image:
            images[category],

        name:
            name,

        category:
            category,

        rating:
            generateRating(
                config.ratingMin,
                config.ratingMax
            ),

        area:
            area,

        city:
            city,

        address:
            `${area}, ${city}, Madhya Pradesh`,

        price:
            randomBetween(
                config.priceMin,
                config.priceMax
            ),

        phone:
            generateDemoPhone(),

        description:
            description,

        facilities:
            facilities[category],

        latitude:
            latitude,

        longitude:
            longitude
    };
}


// ======================================================
// BUILD ALL PLACES
// ======================================================

const places = [];


// ======================================================
// INDORE
// ======================================================

Object.entries({
    hostel: hostelNames.Indore,
    mess: messNames.Indore,
    restaurant: restaurantNames.Indore,
    hospital: hospitalNames.Indore,
    clinic: clinicNames.Indore,
    temple: templeNames.Indore

}).forEach(
    ([category, names]) => {

        names.forEach(
            (name, index) => {

                places.push(
                    createPlace(
                        name,
                        category,
                        "Indore",
                        index
                    )
                );

            }
        );

    }
);


// ======================================================
// BHOPAL
// ======================================================

Object.entries({
    hostel: hostelNames.Bhopal,
    mess: messNames.Bhopal,
    restaurant: restaurantNames.Bhopal,
    hospital: hospitalNames.Bhopal,
    clinic: clinicNames.Bhopal,
    temple: templeNames.Bhopal

}).forEach(
    ([category, names]) => {

        names.forEach(
            (name, index) => {

                places.push(
                    createPlace(
                        name,
                        category,
                        "Bhopal",
                        index
                    )
                );

            }
        );

    }
);


// ======================================================
// VERIFY DATA COUNT
// ======================================================

console.log(
    `Total places prepared: ${places.length}`
);

if (places.length !== 100) {

    console.error(
        "ERROR: Expected exactly 100 places."
    );

    process.exit(1);
}


// ======================================================
// DATABASE CONNECTION
// ======================================================

async function seedDatabase() {

    try {

        console.log("");
        console.log(
            "Connecting to MongoDB..."
        );

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );

        console.log("");
        console.log(
            "Starting SAFE SnapCity data import..."
        );

        let insertedCount = 0;
        let skippedCount = 0;


        // ==================================================
        // CHECK EVERY PLACE BEFORE INSERTING
        // ==================================================

        for (const place of places) {

            const existingPlace =
                await Place.findOne({

                    name:
                        place.name,

                    city:
                        place.city,

                    area:
                        place.area
                });


            // ==============================================
            // ALREADY EXISTS
            // ==============================================

            if (existingPlace) {

                console.log(
                    `SKIPPED: ${place.name} | ${place.city}`
                );

                skippedCount++;

                continue;
            }


            // ==============================================
            // NEW PLACE
            // ==============================================

            await Place.create(
                place
            );

            console.log(
                `INSERTED: ${place.name} | ${place.city}`
            );

            insertedCount++;
        }


        // ==================================================
        // FINAL SUMMARY
        // ==================================================

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "SNAPCITY SEED COMPLETED"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `Total records checked : ${places.length}`
        );

        console.log(
            `New records inserted  : ${insertedCount}`
        );

        console.log(
            `Existing records skip : ${skippedCount}`
        );

        console.log(
            "Records deleted       : 0"
        );

        console.log(
            "=========================================="
        );


        // ==================================================
        // CITY SUMMARY
        // ==================================================

        console.log("");
        console.log(
            "CITY SUMMARY"
        );

        console.log(
            "Indore : 50 places"
        );

        console.log(
            "Bhopal : 50 places"
        );


        // ==================================================
        // CATEGORY SUMMARY
        // ==================================================

        console.log("");
        console.log(
            "CATEGORY SUMMARY PER CITY"
        );

        console.log(
            "Hostels / PG : 10"
        );

        console.log(
            "Mess / Tiffin: 10"
        );

        console.log(
            "Restaurants  : 10"
        );

        console.log(
            "Hospitals    : 10"
        );

        console.log(
            "Clinics      : 5"
        );

        console.log(
            "Temples      : 5"
        );

        console.log("");
        console.log(
            "MongoDB data was NOT deleted."
        );


        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected."
        );

    }

    catch (error) {

        console.error("");
        console.error(
            "=========================================="
        );

        console.error(
            "DATABASE SEEDING FAILED"
        );

        console.error(
            "=========================================="
        );

        console.error(
            error.message
        );


        try {

            await mongoose.disconnect();

        }

        catch (disconnectError) {

            console.error(
                "MongoDB disconnect error:",
                disconnectError.message
            );

        }

        process.exit(1);
    }
}


// ======================================================
// START
// ======================================================

seedDatabase();
