const mongoose = require("mongoose")
const path = require('path');
const cookieParser = require('cookie-parser');
// Account creation database
const AccountDB = require("../module/Account")
const DBPRODUCT = require("../module/Product")
const DBCOUPON = require("../module/Coupon")
const DBORDER = require("../module/Order")
// Setting the way to access the encryption code
require("dotenv").config();
// Access to the secured encryption code
const encryption = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken")
const multer = require('multer');
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
module.exports.upload = multer({ storage });

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
// 
const Token_generation = (id) => {
    return jwt.sign({ id }, encryption, {
        expiresIn: 3 * 24 * 60 * 60
    })
}
// Account creation function
module.exports.register = async (req, res) => {
    const { email, username, name, password } = req.body;
    try {
        // Check the email if it is in use
        const checkEmail = await AccountDB.findOne({ email });
        if (checkEmail) {
            const errors = { email: "This email is already in use. An account cannot be created" };
            return res.status(400).json({ errors });
        }
        // Create a new account
        const NewAccount = await new AccountDB({
            email,
            username,
            name,
            password,

        });
        // Save the email
        await NewAccount.save();
        // Code generation authorization
        const token = Token_generation(NewAccount._id);
        // Return the token code from response
        res.status(201).json({ message: "Login succeeded", token, NewAccount, Status: true });
    } catch (error) {
        res.status(409).json({ error });
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
        console.log(error)
        res.status(409).json({ error });
    }
};

module.exports.get_product = async (req, res) => {
    try {
        const type = req.query.type;
        // Modified part: Use the DBPRODUCT pipeline to get 6 products with the same number of elements
        const result = await DBPRODUCT.aggregate([
            {
                $sample: { size:10 }
            },
            {
                $match: { $sampleRate: 1 }
            }
        ]);

        if (type === "homestore") {
            result.forEach((item) => {
                if (item.images.length > 1) {
                    // إذا كان هناك أكثر من صورة واحدة، اجعلها صورة واحدة
                    item.images = [item.images[0]]; // استخدم الصورة الأولى فقط
                }
            });
        }

        res.status(201).json({ result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

module.exports.filter_product = async (req, res) => {
    const { type , Category } = req.query;
    console.log(type, Category);
    try {
        if(type != "null" && Category != undefined){
            const result = await DBPRODUCT.find({ type, Category });
            console.log(result);
            res.status(201).json({ result });
        }else if(type != "" && Category == undefined){
            const result = await DBPRODUCT.find({ type });
            res.status(201).json({ result });

        }
        else{
            const result = await DBPRODUCT.find({});
            res.status(201).json({ result });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

}
module.exports.use_coupon = async (req, res) => {
    try {
        const { coupon } = req.body;
        console.log(coupon);
        const result = await DBCOUPON.findOne({ coupon: coupon });
        
        if (result) {
            const { _id } = result;
            const use = await DBCOUPON.findOneAndDelete({ _id });
            
            if (use) {
                console.log("true");
                return res.status(201).json({ result: true,use });
            }
        }

        return res.status(400).json({ result: false });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
module.exports.check_token = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const result = await jwt.verify(token, encryption);
        if (result) {
            return res.status(201).json({ result: true , token:result });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
module.exports.add_order = async (req, res) => {
    try {
        const { id, cart, address, name, city, phone,price } = req.body;
        console.log(cart)
        const result = await new DBORDER({
            user: id,
            cart,
            address,
            name,
            city,
            phone,
            price
        })
        await result.save();
        return res.status(201).json({ result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}   





