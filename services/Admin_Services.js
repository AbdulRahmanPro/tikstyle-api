const mongoose = require("mongoose");
const DBURl = require("../module/UrlEncrypted");
const fs = require('fs');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
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

// function customBtoa(input) {
//     const base64 = btoa(input);
//     return base64.replace(/\./g, '-').replace(/\//g, '_');
// }

function generateRandomValue(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomValue = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomValue += characters.charAt(randomIndex);
    }

    return randomValue;
}



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
            await fs.promises.writeFile('.env', `ENRYPTION_CODE="${updatavalue}"`);
            const hashedValue = await hashedText(updatavalue)
            await DBURl.updateOne({}, { url: hashedValue });
            const mailOptions = {
                from: 'mrgames7700@gmail.com',
                to: 'maynkraftalhosni@gmail.com', // استبدلها بعنوان البريد الإلكتروني للمستلم
                subject: 'موضوع البريد الإلكتروني',
                text: ` the Link http://localhost:5173/admin/${hashedValue}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('خطأ في إرسال البريد الإلكتروني: ', error);
                } else {
                    console.log('تم إرسال البريد الإلكتروني بنجاح: ', info.response);
                }
            });
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
    }
    }, time)

};



