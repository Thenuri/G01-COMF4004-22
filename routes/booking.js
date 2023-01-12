const express = require('express');
const router = express.Router();
const {dbQuery} = require('../config/database');
const bookingService = require('../services/bookingService')
const clientController = require('../controllers/clientController');
const ownerController  = require('../controllers/ownerController');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn');
const authenticateJWT = require('../middleware/authMiddleware');

// new trip booking
router.post('/new', authenticateJWT, bookingService.bookTrip)
// router.post('/new', bookingService.bookTrip)
router.get('/payment',getProfileDetailsIfLoggedIn ,(req, res) => {
    res.render('payment');
})

// The bus owner confirms booking
router.post('/confirm/:tripId', authenticateJWT, bookingService.confirmBooking)

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
                    .then(dbQuery("UPDATE `bus` SET `Bus_Availability` = 'available' WHERE `bus`.Bus_ID = ? ", [bus_id]).then(res.send("trip has been cancelled"))
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
/*---------------------------------------------------------------------------------------------------------------*/
router.get('/Ownedtrips', authenticateJWT, async function(req, res, next){
    const accountId = req.body.Account_ID;
    const accountType = req.body.AccountType;
    
    let values,gettrip,getbus,buses;
    if(accountType === "client"){
      try{
        client = await clientController.findCilentByClientId(accountId);  
      }
      catch (error){
  
        throw error
      }
      values = [client.Client_ID]
      gettrip = "SELECT * FROM `trip` WHERE `Client_ID`= ?"
      try{
        dbQuery(gettrip,values).then(result =>{return res.json(result)});
      }
      catch (error){
        throw error
      }
    }else if(accountType === "owner"){
        try{
            owner = await ownerController.findOwnerByOwnerId(accountId);
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
            gettrip = "SELECT * FROM `trip` WHERE `Bus_ID`=?"
            values = [busid] 
            try{
                tripsOfBus = await dbQuery(gettrip,values);
            }
            catch (error){
                throw error
            }
            if (tripsOfBus.length !== 0) {
              tripsOfBus.forEach( async (trip) => {
                console.log("adsfasdf",trip)
                return trip
              } )

            } 
        });
        
        Promise.all(gettrippromise)
        .then(trips => {
          console.log(trips)
          res.json(trips)
        })
     
    }else{
        return res.send("hi")
    }

  
  })
  
     
module.exports = router;


//  get owner id
// get bus ids of all buses beloging to the owner
// using foreach busid get trips  and save them in a variable and send res
