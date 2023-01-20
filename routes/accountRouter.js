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

router.get('/getallaccounts',authenticateJWT,async function(req,res){
    const accountId = req.body.Account_ID;
    const accountType =  req.body.AccountType;
    let getOwners, owners,getClients,clients,accounts,values;
    if(accountType !== "admin"){
        return res.status(403).json({error: {message: "Not admin"}})
    }

     getOwners = "SELECT `Owner_ID`, `account`.`Account_ID`, `Name`, `Address`, `Contact_No`, `Profile_Picture`, `Rating`, `No_Of_Ratings`,`Account_Type`, `Account_Status` FROM bus_owner LEFT JOIN account ON bus_owner.Account_ID = account.Account_ID; "
     owners = await dbQuery(getOwners);
     getClients= "SELECT `Client_ID`, `account`.`Account_ID`, `Name`, `Address`, `Contact_No`, `Profile_Picture`,`Account_Type`, `Account_Status` FROM client LEFT JOIN account ON client.Account_ID = account.Account_ID; "
     clients = await dbQuery(getClients);

     accounts =clients.concat(owners);

     return res.json(accounts);


  
})

/*-------------------------------------------------------------PROFILE VIEW /PROFILE UPDATE*******************************************************/
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
    const ContactNo = req.body.Contact_No;
    const Address = req.body.Address;
    const Profile_Picture = req.body.Profile_Picture
    console.log("Profile picture",Profile_Picture)
    let updates, values;
    if (accountType === "client"){
        client_ac = await clientController.findClientByAccountId(accountId);
        updates = "UPDATE `client` SET `Name` = ?, `Address` = ?, `Contact_No` = ?, `Profile_Picture` = ? WHERE `client`.`Client_ID` = ?"
        values = [Name, Address, ContactNo, Profile_Picture,  client_ac.Client_ID ]
    }else if (accountType === "owner"){
        owner_ac = await ownerController.findOwnerByAccountId(accountId);
        console.log(owner_ac)
        updates = "UPDATE  `bus_owner` SET `Name` = ? , `Address` = ? , `Contact_No` = ?,  `Profile_Picture` = ? WHERE `bus_owner`.`Owner_ID` = ?"
        values = [Name, Address, ContactNo, Profile_Picture, owner_ac.Owner_ID ]
        console.log(values)
    } else {
        return res.json({error: {message: "Account type not valid"}})
    }
    try {
        dbQuery(updates, values).then( (result) => {
            console.log(result)
            res.send("Profile Has been updated!")
        }).catch( (e) => console.log(e))
    }
    catch (error) {
        throw error
    }
})

module.exports = router

