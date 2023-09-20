const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const Admin = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "You must enter your email"],
        unique: true,
        validate: {
            validator: function (value) {
                return isEmail(value); // يتحقق من أن القيمة هي بريد إلكتروني صالح
            },
            message: props => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, "You must enter your password"],
    }
});

Admin.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});
Admin.statics.login = async function (email, password) {

    try {
        const UserModel = this;

        const CheckEmail = await UserModel.findOne({ email });

        if (!CheckEmail) {
            throw new Error("Your Gmail is incorrect. Contact a developer");
        }

        const CheckPassword = await bcrypt.compare(password, CheckEmail.password);

        if (!CheckPassword) {
            throw new Error("The password is incorrect. Contact the developer");
        }

        return CheckEmail;
    } catch (error) {
        // يمكنك التعامل مع الأخطاء هنا، مثل إرسال استجابة خاصة بالخطأ
        console.error(error);
        throw error; // إعادة إلقاء الخطأ إلى المستوى العلوي إذا كنت بحاجة إلى ذلك
    }

}
const AccountAdmin = mongoose.model("AccountAdmin", Admin);

module.exports = AccountAdmin;
