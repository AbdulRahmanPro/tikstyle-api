const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    cart: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    ,
    address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }, 
    phone: {
        type:String,
        required:true
    }
}, {timestamps: true});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
