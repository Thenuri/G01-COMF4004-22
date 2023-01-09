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
            "startTime" : "14:08:48"
    }
    */
        console.log("Hi");
    const busId = req.body.busId;
    const from = req.body.from;
    const to = req.body.to;
    const startDate = req.body.startDate;
    const returnDate = req.body.returnDate;
    const startTime = req.body.startTime;
    
    // MapsApiRequest.distanceMatrixRequest(to, from).catch(e => console.log(e));
    try {
        distanceMatrixResponseData = await MapsApiRequest.distanceMatrixRequest(to, from);
        
    } catch (error) {
        throw error;
    }
    console.log(distanceMatrixResponseData)
    return res.json(distanceMatrixResponseData);

    if (req.body.AccountType !== "client") {
        return res.json({error: {message: "Buses can be booked only by client"}});
    }
    const clientAccountId = req.body.Account_ID

    // Client Id is needed to book a trip therefore find the relavent client account with accountId foreign key
    let client
    try {
        client = await clientController.findClientByAccountId(clientAccountId)
    } catch (error) {
        return res.json({error:{ message: "Error finding client account"}})

    }
    console.log(client)
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

    }
    console.log(bus)

    if (typeof bus === undefined) {
        return res.json({error: {message: "No bus found"}})
    }
    
    // check if bus is available

    if (bus.Bus_Availability !== "available") {
        return res.json({error:{ message: "Bus is already booked"}})
    }

    let owner;
    try {
        owner = await ownerController.findOwnerByOwnerId(bus.Owner_ID)   
    } catch (error) {
        console.log(error.message)
        return res.json({error:{ message: "Could not find bus owner"}})
    }
    // get the account of the owner is active
    console.log(owner)
    let isAccountActive;
    try {
        isAccountActive = await accountController.isAccountActive(owner.Account_ID);
        
    } catch (error) {
        console.log(error.message)
        return res.json({error:{ message: "Error checking bus owner"}});
    }

    if(!isAccountActive) {
        return res.json({error: {message: "Owner's account is not active"}})
    } 

    // TODO later use google maps api to calculate distance
    MapApiRequest.getDistance(to, from);
    const distanceKm = 300;

    // calculate the total amount for the trip
    const tripAmount = distanceKm * bus.Price_Per_km;  // TODO round trip calc
    
    // insert the trip to the table
    sql = "INSERT INTO `trip` ( `Client_ID`, `Bus_ID`, `Trip_From`, `Trip_To`, `Trip_Status`, `Trip_Rating`, `Trip_Comments`, `No_Of_km`, `Trip_Amount`, `Trip_Start_Date`, `Trip_Return_Date`, `Trip_Start_Time`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); "
    values = [clientId, busId, from, to, 'Pending Confirmation', 0, "", distanceKm, tripAmount, startDate, returnDate, startTime]
    dbQuery(sql, values).then(() => {

        // Update bus to unavailable
        updateBusql = "UPDATE `bus` SET `Bus_Availability` = 'unavailable' WHERE `bus`.`Bus_ID` = ?;"
        dbQuery(updateBusql, [busId]).then( () => {
            return res.json({message: "The bus has been booked"});
        }).catch( () => {
            return res.json({error: {message: "Error updating bus"}})
        })

        }        
    ).catch( (err) => {
        console.log(err.message)
        return res.json({error: {message: "Error booking trip"}}
        
        )})


    

}
