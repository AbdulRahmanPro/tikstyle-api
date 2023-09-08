const mongoose = require("mongoose")
const path = require('path');
const cookieParser = require('cookie-parser');
// Account creation database
const AccountDB = require("../module/Account")
// Setting the way to access the encryption code
require("dotenv").config();
// Access to the secured encryption code
const encryption = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken")

    const handleErrors = (error) => {
        let errors = { username: "", password: "" };
        const arry_message = ["Username not found", "The password is incorrect"];
        const type = ["username", "password"];

        for (const i in arry_message) {
            if (error.message.includes(arry_message[i])) {
                if (type[i] === "username") {
                    errors.username = "اسم المستخدم غير موجود";
                } else if (type[i] === "password") {
                    errors.password = "كلمة المرور غير صحيحة";
                }
            }
        }

        return errors;
    };


module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verify your username and password
        const account = await AccountDB.login(username, password);
        const token = Token_generation(account._id); // تم تغيير req._id إلى account._id
        console.log(token);
        res.status(201).json({ message: "Login succeeded", token: token });
    } catch (error) {
        const messageerror = await handleErrors(error);
        res.status(409).json(messageerror); // تم تحديث هنا لإرسال الأخطاء بشكل مباشر
    }
};



// 
const Token_generation = (id) => {
    return jwt.sign({ id }, encryption, {
        expiresIn: 3 * 24 * 60 * 60
    })
}
// Account creation function
module.exports.register = async (req, res) => {
    const { email, username, name, password } = req.body
    try {
        // Check the email if it is in use
        const checkEmail = await AccountDB.findOne({ email })
        if (checkEmail) {
            const errors = { email: "This email is already in use. An account cannot be created" };
            return res.status(400).json({ errors });
        }

        // Create a new account
        const NewAccount = await new AccountDB({
            email,
            username,
            name,
            password
        });

        // Save the email
        await NewAccount.save();

        // Code generation authorization
        const token = Token_generation(NewAccount._id);

        // Return the token code from response
        res.status(201).json({ message: "Login succeeded", token });
    } catch (error) {
        const errors = await handleErrors(error);
        res.status(409).json({ errors });
    }
}


// Account login function 
module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Verify your username and password
        const account = await AccountDB.login(username, password);
        const token = Token_generation(account._id); // تم تغيير req._id إلى account._id
        console.log(token);
        res.status(201).json({ message: "Login succeeded", token: token });
    } catch (error) {
        const messageerror = await handleErrors(error); // تم تصحيح هندسة الأخطاء هنا
        res.status(409).json({ messageerror });
    }
};