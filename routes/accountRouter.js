const express = require('express');
const router = express.Router();
const authWithJWT = require('../middleware/authMiddleware')
const accountController = require('../controllers/accountController');
const {dbQuery} = require('../config/database');
const clientController = require('../controllers/clientController');
const ownerController  = require('../controllers/ownerController');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn');
const authenticateJWT = require('../middleware/authMiddleware');
// const jwt = require("jsonwebtoken");
// const maxAge = 3 * 24  * 60 * 60

router.put('/suspend/:accountId', authWithJWT, accountController.suspendAccount)
router.put('/activate/:accountId', authWithJWT, accountController.activateAccount)

router.get('/profile',getProfileDetailsIfLoggedIn , authWithJWT, (req, res) => {
  res.render('MyProfile');
})
// 1
// router.post('/signout', function(req, res){
//     req.session.destroy(function(err){
//         if(err){
//             console.log(err);
//         }else{
//             res.redirect('/signin');
//         }
//     })
// })

//  2
// router.post('/signout', async function(req,res) {
//     res.cookie("jwt","",{maxAge:1})
//     res.redirect("/signin")
// })

router.get("/profileView",authenticateJWT, async function(req,res){
    const accountId = req.body.Account_ID;
    const accountType =  req.body.AccountType
    console.log('auth', accountId, accountType)
    let getData,value, result;

    if (accountType === "client"){
        client =await clientController.findClientByAccountId(accountId);
        console.log(client)
        result = client
        // getData = "SELECT * FROM `client` WHERE `client`.`Client_ID` = ?"
        // values = [client.Client_ID ]
    }else if (accountType === "owner"){
        owner = await ownerController.findOwnerByAccountId(accountId);
        console.log(owner)
        result = owner;
        // getData = "SELECT * FROM `bus_owner` WHERE `bus_owner`.`Owner_ID` = ?"
        // values = [owner.owner_ID ]
    }else {
        return res.json({error: {message: "Account type not valid"}})
    }
    res.json(result);
})
router.put("/profileUpdate", authenticateJWT, async function(req,res){
    const accountId = req.body.Account_ID
    const accountType =  req.body.AccountType
    const Name = req.body.Name;
    const ContactNo = req.body.ContactNo;
    const Address = req.body.Address;
    let updates, values;
    if (accountType === "client"){
        client_ac = await clientController.findClientByAccountId(accountId);
        console.log(client_ac)
        updates = "UPDATE `client` SET `Name` = ?, `Address` = ?, `Contact_No` = ? WHERE `client`.`Client_ID` = ?"
        values = [Name, Address, ContactNo, client_ac.Client_ID ]
    }else if (accountType === "owner"){
        owner_ac = await ownerController.findOwnerByAccountId(accountId);
        console.log(owner_ac)
        updates = "UPDATE `bus_owner` SET `Contact_No` = ? , `Name` = ? , `Address` = ? WHERE `bus_owner`.`Owner_ID` = ?"
        values = [Name, Address, ContactNo, owner_ac.owner_ID ]
    } else {
        return res.json({error: {message: "Account type not valid"}})
    }
    try {
        dbQuery(updates, values).then(res.send("Profile Has been updated!"))
    }
    catch (error) {
        throw error
    }
})

module.exports = router

