const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');
const authenticateJWT = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn');


router.get('/',getProfileDetailsIfLoggedIn,authenticateJWT, (req, res) => {
    if(req.body.AccountType === "owner"){
        res.render("OwnerDash")
    }else if (req.body.AccountType === "client"){
        res.render("UserDash")
    }else if (req.body.AccountType === "admin"){
        res.render("AdminDash")
    }else{
        res.send("invalid user")
    }
})

module.exports = router;

