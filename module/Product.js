const mongoose = require("mongoose");


const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    Category: {
        type : String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    }
);

const ProductAdd = mongoose.model("Product", Product);

module.exports = ProductAdd;