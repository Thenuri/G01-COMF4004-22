const express = require('express');
const { dbQuery, dbQueryFetchFirstResult } = require('../config/database');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn')
const router = express.Router();

router.get('/',getProfileDetailsIfLoggedIn, (req, res) => {
    res.render('VehiclePage');
})
/* view top trending buses*/
router.get('/vrating', (req,res) => {

    let top,values;
    console.log("lol")
    top = "SELECT * FROM `bus` ORDER BY bus.`Rating` DESC LIMIT 3;"
    try {
        dbQuery(top).then( result => {
            console.log(result)
            return res.json(result)
        })
    }
    catch (error) {
        throw error 
    }
})
  /* filter*/
router.post('/finder',function(req,res){
console.log(req.body);
    seatNo = req.body.seatNo
    Rating = req.body.Rating
    price = req.body.price
    ac = req.body.ac
    start_Date = req.body.start_Date;
    return_Date = req.body.return_Date;
    let sort;
    let select;
    if (seatNo === "null"){
        sartingSeatNo="0"
        endingseatNo ="100"
    }else{
        seatRange=seatNo.split("-")
        sartingSeatNo = seatRange[0]
        endingseatNo = seatRange[1]
    }
    console.log(Rating)
    if(ac === "null"){
        ac = null
    }if(Rating == "null"){
        Rating = 0
    }
    console.log(seatNo,price,ac,Rating)
    if (price === "high to low price"){
        // select = "SELECT * FROM `bus` WHERE ( `No_Of_Seats` BETWEEN ? AND ?) AND (? IS NULL OR`AC_Status` = ?) AND `Bus_Availability`= 'available' AND NOT EXIST (SELECT 1 FROM `trip` WHERE trip.Bus_ID = bus.Bus_ID AND ((DATE(`Trip_Start_Date`) BETWEEN ? AND ?) OR (DATE(`Trip_Return_Date`) BETWEEN ? AND ?))) ORDER BY `Price_Per_km` DESC "
        select = "SELECT * FROM `bus` WHERE (`No_Of_Seats` BETWEEN ? AND ?) AND `Rating`>=? AND (? IS NULL OR `AC_Status` = ?) AND `Bus_Availability`= 'available' AND NOT EXISTS (SELECT 1 FROM `trip` WHERE trip.Bus_ID = bus.Bus_ID AND ((DATE(Trip_Start_Date) BETWEEN ? AND ?) OR (DATE(Trip_Return_Date) BETWEEN ? AND ?))) ORDER BY Price_Per_km DESC"
    }else {
        // select = "SELECT * FROM `bus` WHERE (`No_Of_Seats` BETWEEN ? AND ?) AND (? IS NULL OR`AC_Status` = ?) AND `Bus_Availability`= 'available' AND NOT EXITS (SELECT 1 FROM `trip` WHERE trip.Bus_ID = bus.Bus_ID AND ((DATE(`Trip_Start_Date`) BETWEEN ? AND ?) OR (DATE(`Trip_Return_Date`) BETWEEN ? AND ?))) ORDER BY `Price_Per_km` ASC "
        select = "SELECT * FROM `bus` WHERE (`No_Of_Seats` BETWEEN ? AND ?) AND `Rating`>=? AND (? IS NULL OR `AC_Status` = ?) AND `Bus_Availability`= 'available' AND NOT EXISTS (SELECT 1 FROM `trip` WHERE trip.Bus_ID = bus.Bus_ID AND ((DATE(Trip_Start_Date) BETWEEN ? AND ?) OR (DATE(Trip_Return_Date) BETWEEN ? AND ?))) ORDER BY Price_Per_km ASC"
    
    }  
    /*let select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?) AND ORDER BY `Price_Per_Km` ?"*/
    const values = [sartingSeatNo,endingseatNo,Rating,ac,ac, start_Date, return_Date , start_Date, return_Date ];
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

router.get('/:busId',getProfileDetailsIfLoggedIn, async (req, res) => {
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
});

router.get('/s', (req, res) => {
    res.send("HI")
})

module.exports = router;





