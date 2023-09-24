const mongoose = require("mongoose");


const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,  
    },
    image: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    }
);

const ProductAdd = mongoose.model("Product", Product);

module.exports = ProductAdd;