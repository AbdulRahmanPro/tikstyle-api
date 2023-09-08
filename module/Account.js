const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require('bcrypt');


const AccountNew = new mongoose.Schema({
    email:{
        type: String,
        required : [true,"You must enter your email"],
        unique: true
    },
    username:{
        type:String,
        required:[true,"You must enter username"],
        unique: true
    },
    name:{
        type:String,
        required:[true,"You must enter username"]
    },
    password:{
        type:String,
        required:[true,"You must enter password"]
    }
})

AccountNew.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


AccountNew.statics.login = async function (username, password) {
    try {
        const UserModel = this;
        const user = await UserModel.findOne({ username });

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            } else {
                throw new Error("The password is incorrect");
            }
        } else {
            throw new Error("Username not found");
        }
    } catch (error) {
        throw new Error(error);
    }
};


const Account = mongoose.model("Account",AccountNew)

module.exports = Account