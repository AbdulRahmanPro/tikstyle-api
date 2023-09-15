const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const URLEncrypted = new mongoose.Schema({
    url:{
        type:String,
        unique: true
    }
})




const URlEnc = mongoose.model("URL",URLEncrypted)

module.exports = URlEnc