const express = require('express');
const { dbQuery, dbQueryFetchFirstResult } = require('../config/database');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn')
const router = express.Router();

router.get('/',getProfileDetailsIfLoggedIn, (req, res) => {
    res.render('VehiclePage');
})

  
router.post('/finder',function(req,res){
console.log(req.body);
    seatNo = req.body.seatNo
    price = req.body.price
    ac = req.body.ac
    let sort;
    let select;
    if (seatNo === "null"){
        seatNo = null
    }
    if(ac === "null"){
        ac = null
    }
    console.log(seatNo,price,ac)
    if (price === "high to low price"){
        select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?) AND `Bus_Availability`= 'available' ORDER BY `Price_Per_km` DESC "
    }else {
        select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?) AND `Bus_Availability`= 'available' ORDER BY `Price_Per_km` ASC "
    }  
    /*let select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?) AND ORDER BY `Price_Per_Km` ?"*/
    const values = [seatNo,seatNo,ac,ac];
    try {
        dbQuery(select, values).then( result => {
            console.log(result)
             res.send(result)
        })
    }
    catch (error) {
        throw error
    }
});

router.get('/:busId',async (req, res) => {
    const busId = req.params.busId;

    // get bus details
    let sql = "SELECT * FROM `bus` WHERE `Bus_ID` = ?"
    let values = [busId]
    let bus;

    try {
        bus = await dbQueryFetchFirstResult(sql, values);
    } catch (error) {
        return res.send(error)
    }

    // if no bus found send 404
    if (bus === undefined){
        return res.sendStatus(404);
    }

    console.log(bus)
    // get owner details
    
    const ownerId = bus.Owner_ID;
    sql = "SELECT `name`, `Contact_No` FROM `bus_owner` WHERE `Owner_ID` = ?"
    values = [ownerId]
    let owner;

    try {
        owner = await dbQueryFetchFirstResult(sql, values);
    } catch (error) {
        return res.send(error)
    }

    if (owner === undefined){
        return res.status(404);
    }
    console.log(owner)
    
    const busDetails = {
        ...bus, 
        Owner_Name: owner.name,
        Contact_No: owner.Contact_No
    
    }
    // const busDetails = {
    //     Bus_ID: bus.Bus_ID,
    //     Owner_ID: bus.Owner_ID,
    //     Bus_No: bus.Bus_No,
    //     No_Of_Seats: bus.No_Of_Seats,
    //     AC_Status: bus.AC_Status,
    //     Price_Per_km: bus.Price_Per_km,
    //     Bus_Availability: bus.Bus_Availability,
    //     Bus_Image: bus.Bus_Image,
    //     Bus_Description: bus.Bus_Description,
    //     Driver_Name: bus.Driver_Name,
    //     Owner_Name: owner.Name,
    //     Owner_Contact_No: owner.Contact_No

    // }
    console.log("wada", busDetails)
    return res.render("VehicleDetails", {
        busDetails: busDetails
    });
})

module.exports = router;



