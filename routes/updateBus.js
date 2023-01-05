const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');
const authenticateJWT = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');

router.get("/profileView", function(req,res){

})

router.put("/BusUpdate", authenticateJWT, async function(req,res){
    const Account_ID = req.body.Account_ID
    const Account_Type = req.body.Account_Type
    let updates;

    Account_Type === "owner"

        owner_ac = await ownerController.findOwnerByAccountId(Account_ID);
        console.log(owner_ac)
        updates = "UPDATE `bus` SET `Bus_No` = ? , `No_Of_Seats` = ? , `Price_Per_km` = ? , `Driver_Name` = ? , `AC_Status` = ? WHERE `bus_owner`.`Owner_ID` = ?";
    
})