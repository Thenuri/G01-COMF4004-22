const { dbQuery, dbQueryFetchFirstResult } = require('../config/database');
const accountController = require('../controllers/accountController');
const ownerController = require('../controllers/ownerController');
const clientController = require('../controllers/clientController');
const authenticateJWT = require('../middleware/authMiddleware');

const MapsApiRequest = require('./MapsApiRequestService');
const e = require('express');

exports.bookTrip = async (req, res) => {

    /*
     Expected JSON format eg
    {
            "busId": "2",
            "from": "Colombo",
            "to": "Kandy",
            "startDate" : "2023-02-12",
            "returnDate": "2023-02-15",
 
    }
    */
    const busId = req.body.busId;
    const from = req.body.from;
    const to = req.body.to;
    const startDate = req.body.startDate;
    const returnDate = req.body.returnDate;
  
    
    // MapsApiRequest.distanceMatrixRequest(to, from).catch(e => console.log(e));
    // console.log(distanceMatrixResponseData)
    // return res.json(distanceMatrixResponseData);
    if (req.body.AccountType !== "client") {
        return res.status(403).json({error: {message: "Buses can be booked only by client"}});
    }
    const clientAccountId = req.body.Account_ID


    // Client Id is needed to book a trip therefore find the relavent client account with accountId foreign key
    let client
    try {
        client = await clientController.findClientByAccountId(clientAccountId)
    } catch (error) {
        return res.status(404).json({error:{ message: "Error finding client account"}})

    }
//    console.log(client)
    const clientId = client.Client_ID
    let sql, values;
    
    // Get the bus details
    sql = "SELECT * FROM `bus` WHERE `Bus_ID` = ?"
    values = [busId]
    let bus;
    try {
        bus = await dbQueryFetchFirstResult(sql, values);
    } catch (error) {
        console.log(error);
        return res.status(404).json({error:{message: "Error finding bus"}})

    }
//    console.log(bus)

    if (typeof bus === "undefined") {
        return res.status(404).json({error: {message: "No bus found"}})
    }


    // check if bus is available on that date range TODO

    // get trips for the bus that are not cancelled, or completed between start and end date
    
    sql = "SELECT DATE_FORMAT(Trip_Start_Date, '%Y-%m-%d') as 'Trip_Start_Date' , DATE_FORMAT(Trip_Return_Date, '%Y-%m-%d') as 'Trip_Return_Date' FROM `trip` WHERE `Bus_ID` = ? AND `Trip_Status` != 'completed' AND `Trip_Status` != 'cancelled' AND ((DATE(`Trip_Start_Date`) BETWEEN ? AND ?) OR (DATE(`Trip_Return_Date`) BETWEEN ? AND ?));"
    values = [busId, startDate, returnDate, startDate, returnDate]
    let existingTrips;
    try {
        existingTrips = await dbQuery(sql, values);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:{message: "Error Checking Availability"}})

    }

    // if there are trips then send an error with the day of the trip
    if (existingTrips.length !== 0) {
        let daysString = "";
        existingTrips.forEach( trip => {
            daysString += `${trip.Trip_Start_Date} - ${trip.Trip_Return_Date},  `
        })
        let msg = `The bus is unavailable for booking during the following days - ${daysString} `
        return res.status(409).json({error: {message: msg}})
    }

    // check if bus is available
    if (bus.Bus_Availability !== "available") {
        return res.status(403).json({error:{ message: "Bus is unavailable"}})
    }

    let owner;
    try {
        owner = await ownerController.findOwnerByOwnerId(bus.Owner_ID)   
    } catch (error) {
        console.log(error.message)
        return res.status(404).json({error:{ message: "Could not find bus owner"}})
    }
    // get the account of the owner is active
    console.log(owner)
    let isAccountActive;
    try {
        isAccountActive = await accountController.isAccountActive(owner.Account_ID);
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({error:{ message: "Error checking bus owner"}});
    }

    if(!isAccountActive) {
        return res.status(403).json({error: {message: "Owner's account is not active"}})
    } 


    let distanceMatrixResponse;
    try {
        distanceMatrixResponse = await MapsApiRequest.distanceMatrixRequest(to, from);
    } catch (error) {
        // if the api cannot be accessed
        if (error.code === "ENOTFOUND") {
            console.log("Error getting distance from Maps API: Check network, maps api status, and key")
            return res.status(500).json({error: {message: "Sorry Trip cannot be booked. Error getting distance from Maps API."}});
        }

        return res.status(500).json({error: {message: error.message}});
    }

    const distanceInMetres = distanceMatrixResponse.distanceInMetres * 2; // 2x for the round trip
    const distanceKm = distanceInMetres / 1000;
    console.log("this is distance", distanceKm)
    console.log("after distance")

    // calculate the total amount for the trip
    const tripAmount = (distanceKm * bus.Price_Per_km).toFixed(2);
    
    // insert the trip to the table
    sql = "INSERT INTO `trip` ( `Client_ID`, `Bus_ID`, `Trip_From`, `Trip_To`, `Trip_Status`, `Trip_Rating`, `Trip_Comments`, `No_Of_km`, `Trip_Amount`, `Trip_Start_Date`, `Trip_Return_Date`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); "
    values = [clientId, busId, from, to, 'Pending Confirmation', 0, "", distanceKm, tripAmount, startDate, returnDate]
    dbQuery(sql, values).then( async ( result) => {
        const tripInsertId = result.insertId;
        res.redirect(`/booking/payment/${tripInsertId}`)
        // return res.json({message: `The bus has been booked: Distance: ${distanceKm}Km, Total Cost: ${tripAmount}`});
        }        
    ).catch( (err) => {
        console.log(err.message)
        return res.json({error: {message: "Error booking trip"}}
        
        )})




}

exports.confirmBooking = async (req, res) => {

    const tripId = req.params.tripId;
    if (req.body.AccountType !== "owner"){
        // return res.status(403).json({error: {message: "Only owner can confirm"}})
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
    }
    const accountId = req.body.Account_ID;
    let owner;
    try {
        owner = await ownerController.findOwnerByAccountId(accountId);
    } catch (error) {
        console.log(error)
        return res.status(403).json({error: {message: "Error finding owner account"}})
    }
    if (owner === "undefined") {
        return res.status(403).json({error: {message: "No owner account found"}})
    }

    // get trip from db
    let sql = "SELECT * from `trip` where `Trip_ID` = ?"
    let values = [tripId]
    let trip;
    try {
        trip = await dbQueryFetchFirstResult(sql, values);
        
    } catch (error) {
        console.log(error.message)
        return res.json({error:{ message: "Error finding trip"}});
    }

    if (trip === "undefined") {
        return res.json({error: {message: "No trip found"}})
    }

    let bus;
    sql = "SELECT * from `bus` where `Bus_ID` = ?"
    values = [trip.Bus_ID]
    try {
        bus = await dbQueryFetchFirstResult(sql, values);
        
    } catch (error) {
        console.log(error.message)
        return res.json({error:{ message: "Error finding Bus"}});
    }
    if (bus === "undefined") {
        return res.json({error: {message: "No bus found for the trip"}})
    }

    // check if current current user
    if (bus.Owner_ID !== owner.Owner_ID) {
        // return res.status(403).json({error:{message: "Not the owner of the bus"}})
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
    }
    if (trip.Trip_Status !== "Pending Confirmation") {
        return res.json({error: {message: `Cannot confirm trip is ${trip.Trip_Status}`}});
    }
    
    // update bus to database
    sql = "UPDATE `trip` SET `Trip_Status` = 'Upcoming' WHERE `trip`.`Trip_ID` = ? "
    values = [trip.Trip_ID]
    try {
        trip = await dbQuery(sql, values).then( () => {
            return res.status(200).json({message: "The Trip has been confirmed"})
        })
        
    } catch (error) {
        console.log(error.message);
        return res.json({error:{ message: "Error: Could not confirm booking"}});
    }
}
