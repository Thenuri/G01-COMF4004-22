const express = require('express');
const router = express.Router();
const authWithJWT = require('../middleware/authMiddleware')
const accountController = require('../controllers/accountController');
const {dbQuery} = require('../config/database');
const clientController = require('../controllers/clientController');
const ownerController  = require('../controllers/ownerController');
const authenticateJWT = require('../middleware/authMiddleware');

router.put('/suspend/:accountId', authWithJWT, accountController.suspendAccount)
router.put('/activate/:accountId', authWithJWT, accountController.activateAccount)

router.get('/profile', (req, res) => {
  res.render('MyProfile');
})

router.get("/profileView",authenticateJWT, async function(req,res){
    const accountId = req.body.Account_ID;
    const accountType =  req.body.AccountType
    console.log('auth', accountId, accountType)
    let getData,value;
    
    if (accountType === "client"){
        client =await clientController.findClientByAccountId(accountId);
        console.log(client)
        getData = "SELECT * FROM `client` WHERE `client`.`Client_ID` = ?"
        values = [client.Client_ID ]
    }else if (accountType === "owner"){
        owner = await ownerController.findOwnerByAccountId(accountId);
        console.log(owner)
        getData = "SELECT * FROM `bus_owner` WHERE `bus_owner`.`Owner_ID` = ?"
        values = [owner.owner_ID ]
    }else {
        return res.json({error: {message: "Account type not valid"}})
    }
    try {
        dbQuery(getData, values).then( result => res.json(result));
    }
    catch (error) {
        throw error
    }
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

