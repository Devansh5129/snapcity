
const express = require("express");

const {
    getPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
} = require("../controllers/placeController");

const protect = require("../middleware/authmiddleware");
const adminOnly = require("../middleware/adminmiddleware");

const router = express.Router();


// ===============================
// PUBLIC ROUTES
// ===============================

router.get("/", getPlaces);

router.get("/:id", getPlaceById);


// ===============================
// ADMIN ROUTES
// ===============================

router.post("/", protect, adminOnly, createPlace);

router.put("/:id", protect, adminOnly, updatePlace);

router.delete("/:id", protect, adminOnly, deletePlace);


module.exports = router;
