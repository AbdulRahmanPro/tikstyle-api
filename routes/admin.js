const express = require("express")
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const router = express.Router()
const slugify = require('slugify');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const safeFileName = slugify(originalName, { lower: true });
        cb(null, safeFileName);
    }
});


const upload = multer({ storage: storage });



const {  URLEcn, add_admin , login_admin , check_token,refresh_token,add_product,get_product , remove_product, update_product,update_images,get_users,remove_user,update_user,add_coupon,get_coupon,update_coupon} = require("../services/Admin_Services")
router.post("/product/add", upload.array("images") ,add_product);
router.post("/addAdmin",add_admin)
router.post("/addURlAdmin",URLEcn)
router.post("/login",login_admin )
router.post("/checkToken",check_token)
router.post("/refreshToken",refresh_token)
router.post("/coupon/add",add_coupon)
router.get("/coupon/get",get_coupon)
router.get("/product/get",get_product)
router.get("/user/get",get_users)
router.put("/product/update",update_product)
router.put("/image/update/:id",upload.array("images"),update_images )
router.put("/user/update/:id",update_user)
router.put("/coupon/update/:id",update_coupon)
router.delete("/product/remove/:id",remove_product)
router.delete("/user/remove/:id",remove_user)

module.exports = router