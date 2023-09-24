const express = require("express")
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const router = express.Router()
const {  URLEcn, add_admin , login_admin , check_token,refresh_token,add_product} = require("../services/Admin_Services")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/addAdmin",add_admin)
router.post("/addURlAdmin",URLEcn)
router.post("/login",login_admin )
router.post("/checkToken",check_token)
router.post("/refreshToken",refresh_token)
router.post("/addProduct", upload.single("image"), add_product);
module.exports = router