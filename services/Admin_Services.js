const mongoose = require("mongoose");
const DBURl = require("../module/UrlEncrypted");
const DBADMIN = require("../module/Admin")
const DBPRODUCT = require("../module/Product")
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Access to the secured encryption code
const encryption = process.env.TOKEN_SECRET;

// Access to the secured encryption code
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage }).single('file');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mrgames7700@gmail.com', // استبدلها بعنوان البريد الإلكتروني الخاص بك
        pass: 'moyhoeenrrnqbxup', // استبدلها بكلمة المرور أو كلمة مرور التطبيق الخاصة بك
    },
});
const hashedText = async (text) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedText = (await bcrypt.hash(text, salt)).replace(/\./g, '-').replace(/\//g, '_');
        return hashedText;
    } catch (error) {
        throw error;
    }
};

const NewToken = (id) => {
    return jwt.sign({ id }, encryption, {
        expiresIn: 1 * 24 * 60 * 60
    })
}
// function customBtoa(input) {
//     const base64 = btoa(input);
//     return base64.replace(/\./g, '-').replace(/\//g, '_');
// }


module.exports.URLEcn = async (req, res) => {
    const { url } = req.body;
    console.log(url);
    try {
        const newUrlAdmin = await new DBURl({
            url
        });
        await newUrlAdmin.save();
        res.status(201).json({ message: "New URL DashBordAdmin" });
    } catch (error) {
        res.status(400).json({ message: "There is an error accessing the admin page. Please contact the developer as soon as possible" });
    }
};
module.exports.Automatic_update_URL = async () => {
    const time = 1 * 24 * 60 * 60
    const updatavalue = "/dashbord/admin"
    setInterval(async () => {
        try {
            const document = await DBURl.findOne({});
            if (document) {
                const hashedValue = await hashedText(updatavalue)
                await DBURl.updateOne({}, { url: hashedValue });
                // const mailOptions = {
                //     from: 'mrgames7700@gmail.com',
                //     to: 'maynkraftalhosni@gmail.com', // استبدلها بعنوان البريد الإلكتروني للمستلم
                //     subject: 'موضوع البريد الإلكتروني',
                //     text: ` the Link http://localhost:5173/admin/${hashedValue}`,
                // };
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         console.error('خطأ في إرسال البريد الإلكتروني: ', error);
                //     } else {
                //         console.log('تم إرسال البريد الإلكتروني بنجاح: ', info.response);
                //     }
                // });
            }
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    }, time)

};

module.exports.add_admin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // قم بإجراء التحقق من صحة البريد الإلكتروني وكلمة المرور هنا
        const CheckEmail = await DBADMIN.findOne({ email })

        if (CheckEmail) {
            res.status(403).json({ message: "This email has been used before" })
            return;
        }

        if (!CheckEmail) {
            const Account = new DBADMIN({
                email,
                password,
            });

            await Account.save();

            const newtoken = NewToken(Account._id);

            res.cookie("TokenAdmin", newtoken);
            res.status(201).json({
                message: "Welcome back, admin. Are you ready to work?",
                token: newtoken,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Contact the developer quickly" });
    }
};

module.exports.login_admin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // التحقق من صحة البريد الإلكتروني وكلمة المرور هنا
        const login = await DBADMIN.login(email, password);
        if (!login) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = NewToken(login._id);
        res.cookie("TokenAdmin", token, { expiresIn: 1 * 24 * 60 * 60 });
        res.status(201).json({ message: "Welcome back, admin to start logging in", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error. Contact the developer" });
    }
};

// Check the token. Is it a valid token for the admin only?
module.exports.check_token = async (req, res) => {
    // barer token
    const barerToken = req.headers.authorization;
    if (!barerToken) {
        res.status(403).json({ message: "You are not authorized to access this page" })
        return;
    } else {
        const token = barerToken.split(" ")[1];
        try {
            const decoded = jwt.verify(token, encryption);
            const admin = await DBADMIN.findById(decoded.id);
            if (!admin) {
                res.status(403).json({ message: "You are not authorized to access this page" })
                return;
            } else {
                res.status(200).json({ message: "Welcome back, admin to start logging in" })
                return;
            }
        } catch (error) {
            res.status(403).json({ message: "You are not authorized to access this page" })
            return;
        }
    }
}

// refresh token
module.exports.refresh_token = async (req, res) => {
    const barerToken = req.headers.authorization;
    if (!barerToken) {
        res.status(403).json({ message: "You are not authorized to access this page" })
        return;
    } else {
        const token = barerToken.split(" ")[1];
        try {
            const decoded = jwt.verify(token, encryption);
            const admin = await DBADMIN.findById(decoded.id);
            if (!admin) {
                res.status(403).json({ message: "You are not authorized to access this page" })
                return;
            } else {
                const newtoken = NewToken(admin._id);
                res.cookie("TokenAdmin", newtoken, { expiresIn: 1 * 24 * 60 * 60 });
                res.status(201).json({ message: "Welcome back, admin to start logging in", token: newtoken });
                return;
            }
        } catch (error) {
            res.status(403).json({ message: "You are not authorized to access this page" })
            return;
        }
    }
}

module.exports.add_product = async (req, res) => {
    try {
        const { name, price, quantity, description, type, image } = req.body;
        image = req.file.filename;
        const newProduct = await new DBPRODUCT({
            name,
            quantity,
            price,
            description,
            type,
            image
        });
        await newProduct.save();
        res.status(201).json({ message: "New Product" });
        
    } catch (error) {
        res.status(400).json({ message: "There is an error accessing the admin page. Please contact the developer as soon as possible" });
        console.log(error);
    }
};


