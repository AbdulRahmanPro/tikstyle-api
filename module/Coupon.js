



const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require('bcrypt');


const Coupon = new mongoose.Schema({
  coupon:{
    type: String,
    required: [true, "You must enter coupon"],
    unique: true
  },
  rate:{
    type: String,
    required: [true, "You must enter rate"]

  }
})



const coupon = mongoose.model("coupon", Coupon)

module.exports = coupon