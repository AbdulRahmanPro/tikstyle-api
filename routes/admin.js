const express = require("express")
const router = express.Router()
const {Automatic_update_URL , URLEcn} = require("../services/Admin_Services")


router.post("/addURlAdmin",URLEcn)

module.exports = router