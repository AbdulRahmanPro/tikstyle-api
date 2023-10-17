const express = require('express');
const router = express.Router();
const {login,register,get_product ,filter_product,use_coupon , check_token,add_order} = require("../services/Api_Services")
/* GET users listing. */


router.post("/login",login)
router.post("/register",register)
router.post("/check_token",check_token)
router.post("/use_coupon",use_coupon)
router.post("/order/add",add_order)
router.get("/get_prodeuct",get_product)
router.get("/product" , filter_product)



module.exports = router;
