
// ==========================================
// SNAPCITY PLACE CONTROLLER
// ==========================================

const mongoose = require("mongoose");
const Place = require("../models/Place");


// ==========================================
// HELPER — ESCAPE REGEX
// ==========================================

function escapeRegex(value) {

    return String(value)
        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
}


// ==========================================
// ALLOWED CATEGORIES
// ==========================================

const allowedCategories = [
    "hostel",
    "mess",
    "restaurant",
    "hospital",
    "clinic",
    "temple"
];


// ==========================================
// GET PLACES
// ==========================================

const getPlaces = async (req, res) => {

    try {

        const {
            city,
            category,
            area,
            minRating,
            maxPrice,
            search
        } = req.query;


        // --------------------------------------
        // BUILD FILTER
        // --------------------------------------

        const filter = {};


        // --------------------------------------
        // CITY
        // --------------------------------------

        if (city && city.trim() !== "") {

            filter.city =
                new RegExp(
                    `^${escapeRegex(city.trim())}$`,
                    "i"
                );
        }


        // --------------------------------------
        // CATEGORY
        // --------------------------------------

        if (
            category &&
            category.trim() !== ""
        ) {

            const cleanCategory =
                category.trim().toLowerCase();

            if (
                allowedCategories.includes(
                    cleanCategory
                )
            ) {

                filter.category =
                    cleanCategory;

            } else {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid place category"
                });
            }
        }


        // --------------------------------------
        // AREA
        // --------------------------------------

        if (area && area.trim() !== "") {

            filter.area =
                new RegExp(
                    escapeRegex(area.trim()),
                    "i"
                );
        }


        // --------------------------------------
        // MINIMUM RATING
        // --------------------------------------

        if (
            minRating !== undefined &&
            minRating !== ""
        ) {

            const rating =
                Number(minRating);

            if (
                Number.isNaN(rating) ||
                rating < 0 ||
                rating > 5
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Minimum rating must be between 0 and 5"
                });
            }

            filter.rating = {
                $gte: rating
            };
        }


        // --------------------------------------
        // MAXIMUM PRICE
        // --------------------------------------

        if (
            maxPrice !== undefined &&
            maxPrice !== ""
        ) {

            const price =
                Number(maxPrice);

            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Maximum price must be a valid positive number"
                });
            }

            filter.price = {
                $lte: price
            };
        }


        // --------------------------------------
        // SEARCH
        // --------------------------------------

        if (
            search &&
            search.trim() !== ""
        ) {

            const safeSearch =
                escapeRegex(
                    search.trim()
                );

            const searchRegex =
                new RegExp(
                    safeSearch,
                    "i"
                );

            filter.$or = [

                {
                    name:
                        searchRegex
                },

                {
                    area:
                        searchRegex
                },

                {
                    address:
                        searchRegex
                }
            ];
        }


        console.log(
            "MongoDB Filter:",
            filter
        );


        // --------------------------------------
        // FETCH PLACES
        // --------------------------------------

        const places =
            await Place.find(filter)
                .sort({
                    rating: -1
                });


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.json(
            places
        );

    } catch (error) {

        console.error(
            "Get places error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch places"
        });
    }
};


// ==========================================
// GET PLACE BY ID
// ==========================================

const getPlaceById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // --------------------------------------
        // VALIDATE OBJECT ID
        // --------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid place ID"
            });
        }


        // --------------------------------------
        // FIND PLACE
        // --------------------------------------

        const place =
            await Place.findById(id);


        if (!place) {

            return res.status(404).json({

                success: false,

                message:
                    "Place not found"
            });
        }


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.json({

            success: true,

            data: place
        });

    } catch (error) {

        console.error(
            "Get place by ID error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch place"
        });
    }
};


// ==========================================
// VALIDATE PLACE DATA
// ==========================================

function validatePlaceData(data) {

    const {
        name,
        city,
        category,
        area,
        address,
        phone,
        description
    } = data;


    // --------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------

    if (
        !name ||
        !city ||
        !category ||
        !area ||
        !address ||
        !phone ||
        !description
    ) {

        return (
            "Name, city, category, area, address, phone and description are required"
        );
    }


    // --------------------------------------
    // STRING LENGTH VALIDATION
    // --------------------------------------

    if (String(name).trim().length < 2) {

        return "Place name is too short";
    }

    if (String(name).trim().length > 150) {

        return "Place name is too long";
    }

    if (String(city).trim().length > 100) {

        return "City name is too long";
    }

    if (String(area).trim().length > 100) {

        return "Area name is too long";
    }

    if (String(address).trim().length > 300) {

        return "Address is too long";
    }

    if (String(phone).trim().length > 30) {

        return "Phone number is too long";
    }

    if (String(description).trim().length > 2000) {

        return "Description is too long";
    }


    // --------------------------------------
    // CATEGORY VALIDATION
    // --------------------------------------

    if (
        !allowedCategories.includes(
            String(category)
                .trim()
                .toLowerCase()
        )
    ) {

        return "Invalid place category";
    }


    // --------------------------------------
    // NUMBER VALIDATION
    // --------------------------------------

    if (
        data.price !== null &&
        data.price !== undefined &&
        data.price !== ""
    ) {

        const price =
            Number(data.price);

        if (
            Number.isNaN(price) ||
            price < 0
        ) {

            return "Price must be a valid positive number";
        }
    }


    if (
        data.rating !== null &&
        data.rating !== undefined &&
        data.rating !== ""
    ) {

        const rating =
            Number(data.rating);

        if (
            Number.isNaN(rating) ||
            rating < 0 ||
            rating > 5
        ) {

            return "Rating must be between 0 and 5";
        }
    }


    if (
        data.latitude !== null &&
        data.latitude !== undefined &&
        data.latitude !== ""
    ) {

        const latitude =
            Number(data.latitude);

        if (
            Number.isNaN(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {

            return "Latitude must be between -90 and 90";
        }
    }


    if (
        data.longitude !== null &&
        data.longitude !== undefined &&
        data.longitude !== ""
    ) {

        const longitude =
            Number(data.longitude);

        if (
            Number.isNaN(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {

            return "Longitude must be between -180 and 180";
        }
    }


    return null;
}


// ==========================================
// CREATE PLACE
// ==========================================

const createPlace = async (req, res) => {

    try {

        const data = req.body;


        // --------------------------------------
        // VALIDATE DATA
        // --------------------------------------

        const validationError =
            validatePlaceData(data);

        if (validationError) {

            return res.status(400).json({

                success: false,

                message:
                    validationError
            });
        }


        // --------------------------------------
        // PREPARE DATA
        // --------------------------------------

        const placeData = {

            name:
                String(data.name).trim(),

            city:
                String(data.city).trim(),

            category:
                String(data.category)
                    .trim()
                    .toLowerCase(),

            area:
                String(data.area).trim(),

            address:
                String(data.address).trim(),

            phone:
                String(data.phone).trim(),

            description:
                String(data.description).trim(),

            price:
                data.price === "" ||
                data.price === undefined
                    ? null
                    : data.price,

            rating:
                data.rating === "" ||
                data.rating === undefined
                    ? null
                    : data.rating,

            image:
                data.image
                    ? String(data.image).trim()
                    : "",

            facilities:
                Array.isArray(data.facilities)
                    ? data.facilities
                        .map(function (item) {
                            return String(item).trim();
                        })
                        .filter(function (item) {
                            return item !== "";
                        })
                    : [],

            latitude:
                data.latitude === "" ||
                data.latitude === undefined
                    ? null
                    : data.latitude,

            longitude:
                data.longitude === "" ||
                data.longitude === undefined
                    ? null
                    : data.longitude
        };


        // --------------------------------------
        // CREATE
        // --------------------------------------

        const place =
            new Place(placeData);


        const savedPlace =
            await place.save();


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Place created successfully",

            data:
                savedPlace
        });

    } catch (error) {

        console.error(
            "Create place error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create place"
        });
    }
};


// ==========================================
// UPDATE PLACE
// ==========================================

const updatePlace = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // --------------------------------------
        // VALIDATE ID
        // --------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid place ID"
            });
        }


        const data =
            req.body;


        // --------------------------------------
        // VALIDATE DATA
        // --------------------------------------

        const validationError =
            validatePlaceData(data);

        if (validationError) {

            return res.status(400).json({

                success: false,

                message:
                    validationError
            });
        }


        // --------------------------------------
        // PREPARE UPDATE
        // --------------------------------------

        const updateData = {

            name:
                String(data.name).trim(),

            city:
                String(data.city).trim(),

            category:
                String(data.category)
                    .trim()
                    .toLowerCase(),

            area:
                String(data.area).trim(),

            address:
                String(data.address).trim(),

            phone:
                String(data.phone).trim(),

            description:
                String(data.description).trim(),

            price:
                data.price === "" ||
                data.price === undefined
                    ? null
                    : data.price,

            rating:
                data.rating === "" ||
                data.rating === undefined
                    ? null
                    : data.rating,

            image:
                data.image
                    ? String(data.image).trim()
                    : "",

            facilities:
                Array.isArray(data.facilities)
                    ? data.facilities
                        .map(function (item) {
                            return String(item).trim();
                        })
                        .filter(function (item) {
                            return item !== "";
                        })
                    : [],

            latitude:
                data.latitude === "" ||
                data.latitude === undefined
                    ? null
                    : data.latitude,

            longitude:
                data.longitude === "" ||
                data.longitude === undefined
                    ? null
                    : data.longitude
        };


        // --------------------------------------
        // UPDATE
        // --------------------------------------

        const updatedPlace =
            await Place.findByIdAndUpdate(

                id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }
            );


        // --------------------------------------
        // PLACE NOT FOUND
        // --------------------------------------

        if (!updatedPlace) {

            return res.status(404).json({

                success: false,

                message:
                    "Place not found"
            });
        }


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.json({

            success: true,

            message:
                "Place updated successfully",

            data:
                updatedPlace
        });

    } catch (error) {

        console.error(
            "Update place error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update place"
        });
    }
};


// ==========================================
// DELETE PLACE
// ==========================================

const deletePlace = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // --------------------------------------
        // VALIDATE ID
        // --------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid place ID"
            });
        }


        // --------------------------------------
        // DELETE
        // --------------------------------------

        const deletedPlace =
            await Place.findByIdAndDelete(
                id
            );


        if (!deletedPlace) {

            return res.status(404).json({

                success: false,

                message:
                    "Place not found"
            });
        }


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.json({

            success: true,

            message:
                "Place deleted successfully",

            data:
                deletedPlace
        });

    } catch (error) {

        console.error(
            "Delete place error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to delete place"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    getPlaces,

    getPlaceById,

    createPlace,

    updatePlace,

    deletePlace
};
