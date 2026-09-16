const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    area: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        default: null
    },

    rating: {
        type: Number,
        default: 0
    },

    phone: {
        type: String,
        required: true
    },

    facilities: {
        type: [String],
        default: []
    },

    description: {
        type: String,
        required: true
    }

});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;