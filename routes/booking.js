const express = require('express');
const router = express.Router();
const {dbQuery} = require('../config/database');
const bookingService = require('../services/bookingService')
const clientController = require('../controllers/clientController');
const ownerController  = require('../controllers/ownerController');
const authenticateJWT = require('../middleware/authMiddleware');

// new trip booking
router.post('/new', authenticateJWT, bookingService.bookTrip)
// router.post('/new', bookingService.bookTrip)


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
module.exports = router;



