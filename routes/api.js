const express = require('express');
const router = express.Router();
const {login,register} = require("../services/Api_Services")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login",login)
router.post("/register",register)



module.exports = router;
