const express = require("express")
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });



const {  URLEcn, add_admin , login_admin , check_token,refresh_token,add_product,get_product , remove_product} = require("../services/Admin_Services")
router.post("/product/add", upload.array("images") ,add_product);
router.post("/addAdmin",add_admin)
router.post("/addURlAdmin",URLEcn)
router.post("/login",login_admin )
router.post("/checkToken",check_token)
router.post("/refreshToken",refresh_token)
router.get("/product/get",get_product)
router.post("/product/remove/:id",remove_product)

module.exports = router