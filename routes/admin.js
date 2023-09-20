const express = require("express")
const router = express.Router()
const {  URLEcn, add_admin , login_admin , check_token,refresh_token} = require("../services/Admin_Services")

router.post("/addAdmin",add_admin)
router.post("/addURlAdmin",URLEcn)
router.post("/login",login_admin )
router.post("/checkToken",check_token)
router.post("/refreshToken",refresh_token)
module.exports = router