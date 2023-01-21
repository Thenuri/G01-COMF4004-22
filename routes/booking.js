const express = require('express');
const router = express.Router();
const {dbQuery, dbQueryFetchFirstResult} = require('../config/database');
const bookingService = require('../services/bookingService')
const clientController = require('../controllers/clientController');
const ownerController  = require('../controllers/ownerController');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn');
const authenticateJWT = require('../middleware/authMiddleware');

// new trip booking
router.post('/new', authenticateJWT, bookingService.bookTrip)
// router.post('/new', bookingService.bookTrip)
router.get('/payment/:tripId',getProfileDetailsIfLoggedIn ,async (req, res) => {
  tripId = req.params.tripId;
  sql = "SELECT `Trip_ID`,`Bus_No`,`Trip_Status`,`Trip_From`, `Trip_To`, `bus`.`Rating`, `bus`.`No_Of_Ratings`, `bus`.`Bus_Image`,`No_Of_km`, `Trip_Amount`, DATE_FORMAT(Trip_Start_Date, '%Y-%m-%d') as 'Trip_Start_Date', DATE_FORMAT(Trip_Return_Date, '%Y-%m-%d') as 'Trip_Return_Date' ,`Contact_No`, `Name`, `Driver_Name`, `AC_Status` , `No_Of_Seats`, `Price_Per_km` FROM `trip` JOIN `bus` ON `trip`.`Bus_ID` = `bus`.`Bus_ID` JOIN `bus_owner` ON `bus`.`Owner_ID` = `bus_owner`.`Owner_ID` WHERE `trip`.`Trip_ID`= ?;"
  values = [tripId]
  const trip = await dbQueryFetchFirstResult(sql, values); console.log(trip)
  res.render('payment', {trip : trip});

})

// The bus owner confirms booking
router.put('/confirm/:tripId', authenticateJWT, bookingService.confirmBooking)

/* CANCEL BOOKING*/
router.put('/cancel/:id',function(req,res,next){
    let findConfirmation = "SELECT * FROM `trip` WHERE `trip`.`Trip_ID`= ?"
    const value = [req.params.id];
    try {
         dbQuery(findConfirmation, value).then(result =>{
            if (result[0].Trip_Status === 'completed') {
                return res.send("error, Cannot cancel alredy completed")
            }else if (result[0].Trip_Status === 'cancelled'){
                return res.send("error,alredy cancelled")
            }else{
                let bus_id = result[0].Bus_ID
                let cancelBooking = "UPDATE `trip` SET `Trip_Status` = 'cancelled' WHERE `trip`.`Trip_ID` = ?"
                try {
                    dbQuery(cancelBooking, value)
                    .then(res.send("trip has been cancelled")
                    )
               }
               catch (error) {
                   throw error
               }    
            }
         })
    } 
    catch (error) {
        throw error
    }
})
router.put('/complete/:id',function(req,res,next){
  let findConfirmation = "SELECT * FROM `trip` WHERE `trip`.`Trip_ID`= ?"
    const value = [req.params.id];
    try {
         dbQuery(findConfirmation, value).then(result =>{
            if (result[0].Trip_Status === 'Upcoming') {
                  let completeBooking = "UPDATE `trip` SET `Trip_Status` = 'completed' WHERE `trip`.`Trip_ID` = ?"
                  try {
                      dbQuery(completeBooking, value)
                      .then(res.send("trip has been completed")
                      )
                      }
                      catch (error) {
                          throw error
                      }   
            } else {
                res.status(403).json({error: {message: "Connot set as completed this is not an Upcoming trip"}})
            }
         } 
         
         )
    } 
    catch (error) {
        throw error
    }
})
/* DASHBOARD CLIENT AND OWNER TRIPS*/ 
/*---------------------------------------------------------------------------------------------------------------*/
router.get('/Ownedtrips', authenticateJWT, async function(req, res, next){
    const accountId = req.body.Account_ID;
    const accountType = req.body.AccountType;
    
    let values,gettrip,getbus,buses;
    if(accountType === "client"){
      try{
        client = await clientController.findClientByAccountId(accountId);  
      }
      catch (error){
  
        throw error
      }
      values = [client.Client_ID]
            gettrip = "SELECT DISTINCT `Trip_ID`,`Bus_No`,`Trip_Status`,`Trip_From`, `Trip_To`, `Trip_Rating`,`No_Of_km`, `Trip_Amount`, DATE_FORMAT(Trip_Start_Date, '%Y-%m-%d') as 'Trip_Start_Date', DATE_FORMAT(Trip_Return_Date, '%Y-%m-%d') as 'Trip_Return_Date' ,`Contact_No`, `Name` FROM `trip` JOIN `bus` ON `trip`.`Bus_ID` = `bus`.`Bus_ID` JOIN `bus_owner` ON `bus`.`Owner_ID` = `bus_owner`.`Owner_ID` WHERE `trip`.`Client_ID`= ?;"
           // gettrip = "SELECT `Trip_ID`,`Bus_No`,`Trip_From`, `Trip_To`, `No_Of_km`, `Trip_Amount`, DATE_FORMAT(Trip_Start_Date, '%Y-%m-%d') as 'Trip_Start_Date', DATE_FORMAT(Trip_Return_Date, '%Y-%m-%d') as 'Trip_Return_Date' ,`Contact_No`, `Name`FROM `trip`,`bus_owner`,`bus` WHERE `Client_ID`=?"
      try{
        dbQuery(gettrip,values).then(result =>{return res.json(result)});
      }
      catch (error){
        throw error
      }
    }else if(accountType === "owner"){
        try{
            owner = await ownerController.findOwnerByAccountId(accountId);
          }
          catch (error){
            throw error
          }
          values = [owner.Owner_ID]
          getbus = "SELECT `Bus_ID` FROM `bus` WHERE `Owner_ID`= ?"
          
          try{
             buses = await dbQuery(getbus,values);
          }
          catch (error){
      
            throw error
          }
          console.log(buses)
          
          const gettrippromise = buses.map(async (bus) => {
            let tripsOfBus;
            let busid = bus.Bus_ID;
            gettrip = "SELECT DISTINCT `Trip_ID`,`Bus_No`,`Trip_Status`,`Trip_From`, `Trip_To`,`Trip_Rating`, `No_Of_km`, `Trip_Amount`, DATE_FORMAT(Trip_Start_Date, '%Y-%m-%d') as 'Trip_Start_Date', DATE_FORMAT(Trip_Return_Date, '%Y-%m-%d') as 'Trip_Return_Date' ,`Contact_No`, `Name` FROM `trip` JOIN `bus` ON `trip`.`Bus_ID` = `bus`.`Bus_ID` JOIN `client` ON `trip`.`client_ID` = `client`.`client_ID` WHERE `bus`.`Bus_ID`= ?;"
            values = [busid] 
            console.log(busid)
            try {
              tripsOfBus = await dbQuery(gettrip,values);
              console.log( tripsOfBus)
            } catch (error) {
              throw error;
            }

            if (tripsOfBus.length !== 0) {
              return tripsOfBus;
            } 
          });
          
          Promise.all(gettrippromise)
          .then(trips => {
            
            trips = Array.prototype.concat.apply([], trips);  // Get the trips to one array

            // filter out the undefined values
            trips = trips.filter( trip => { 
              if (trip !== undefined) {
                return trip;
              }
            })

            res.json(trips);
          
          })
          
     
    }else{
        return res.send("hi")
    }

  
  })

  router.put('/rating/:tripId', authenticateJWT, async (req, res) => {
    if (req.body.AccountType !== 'client') {
      res.status(403).json({error: {message: "Only client can rate"}})
    }
  
    const tripId = req.params.tripId;
    const rating = req.body.rating;
  
    console.log
    
    const accountId = req.body.Account_ID;
    let client;
    try {
      client = await clientController.findClientByAccountId(accountId)
      
    } catch (error) {
      res.status(500).send("Error")
    }
  
    let sql, values;
  
    sql = "SELECT `Client_ID`, `Trip_Rating`, `Trip_Status` FROM `trip` WHERE `trip`.`Trip_ID` = ?; "
    values = [ tripId ]
    let result = await dbQuery(sql, values);
    if ( result.length === 0) {
      return res.status(404).json({error: {message: "No Trip found"}})
    }
  
    if ( result[0].Trip_Status !== "completed") {
      return res.status(403).json({error: {message: "Cannot review trips which are not completed"}})
    }
  
    if ( result[0].Client_ID !== client.Client_ID ) {
      console.log(result[0],  client)
      return res.status(403).json({error: {message: "Not the client of the trip"}})
    }
    if ( result[0].Trip_Rating !== 0) {
      return res.status(409).json({error: {message: "Trip is already rated"}})
    }
  
    // Update trip rating
    sql = "UPDATE `trip` SET `Trip_Rating` = ? WHERE `trip`.`Trip_ID` = ? AND `trip`.`Client_ID` = ?; "
    values = [rating, tripId, client.Client_ID ]
    dbQuery(sql, values)
    .then( () => {
  
      // Update bus rating. Calculates new average rating
      sql = "UPDATE `bus` JOIN `trip` ON `bus`.Bus_ID = `trip`.Bus_ID SET `bus`.`Rating` = ( (`bus`.`Rating` * `bus`.`No_Of_Ratings`) + ? )/( `bus`.`No_Of_Ratings` + 1 ) ,`bus`.`No_Of_Ratings` = `bus`.`No_Of_Ratings` + 1 WHERE `bus`.Bus_ID = `trip`.Bus_ID AND `trip`.Trip_ID = ?;  "
      values = [rating, tripId]
      dbQuery(sql, values)
      .then( () => {
  
        // Updates owners rating calculates new average rating
        sql = "UPDATE bus_owner JOIN bus ON bus.Owner_ID = bus_owner.Owner_ID JOIN trip ON trip.Bus_ID = bus.Bus_ID SET bus_owner.Rating = ( (bus_owner.Rating * bus_owner.No_Of_Ratings) + ? )/( bus_owner.No_Of_Ratings + 1 ) , bus_owner.No_Of_Ratings = bus_owner.No_Of_Ratings + 1 WHERE `trip`.Trip_ID = ?;"
        values = [rating, tripId]
        dbQuery(sql, values).then( () => {
          return res.json({message: "Successfully rated the trip"})
        })
        .catch( () => {
          return res.status(500).json({error: {message: "Error Updating Owner rating"}})
        })
      })
      .catch( (e) => {
        console.log(e)
        return res.status(500).json({error: {message: "Error Updating Bus rating"}})
      })
    }
      )
      .catch( () => {
        return res.status(500).json({error: {message: "Error Updating Trip rating"}})
      })
  
  })
  


     
module.exports = router;


//  get owner id
// get bus ids of all buses beloging to the owner
// using foreach busid get trips  and save them in a variable and send res