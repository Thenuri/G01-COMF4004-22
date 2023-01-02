const express = require('express');
const router = express.Router();
const {dbQuery} = require('../config/database')

router.put('/cancel/:id',function(req,res,next){

    let cancelBooking = "UPDATE `trip` SET `Trip_Status` = 'cancel' WHERE `trip`.`Trip_ID` = ?"

    const values = [req.params.id];
        try {
             dbQuery(cancelBooking, values).then(res.send("well done"))
        } 
        catch (error) {
            throw error
        }
        
})

router.get('/find/:id',function(req,res,next){

    let findConfirmation = "SELECT `Trip_Status` FROM `trip` WHERE `trip`.`Trip_ID`= ?"


    const values = [req.params.id];
    try {
         dbQuery(findConfirmation, values).then(result =>{
            if (result[0].Trip_Status === 'completed') {
                res.send("error, Cannot cancel alredy completed")
            }
         })
    } 
    catch (error) {
        throw error
    }

   
})     

module.exports = router;