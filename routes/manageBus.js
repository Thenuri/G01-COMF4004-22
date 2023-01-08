const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');


router.get('/managebus', (req, res) => {
  res.render('ManageBus');
})

router.patch('/addBus', function(req, res, next) {
    const Bus_No = req.body.Bus_No;
    const No_Of_Seats = req.body.No_Of_Seats;
    const Price_Per_km = req.body.Price_Per_km;
    const AC_Status = req.body.AC_Status;
    const Driver_Name = req.body.Driver_Name;
// TODO get account id using jwtAuth middleware, find owner id and Add owner id to query , 
    const sql = "INSERT INTO bus (Bus_No, No_Of_Seats, Price_Per_km, AC_Status,Driver_Name) VALUES (?,?,?,?,?)";
    const values = [Bus_No,No_Of_Seats,Price_Per_km,AC_Status,Driver_Name];

    try{
      return dbQuery(sql, values).then(res.send("Succesfull"))
    }
    catch (error){
      throw error
    }

})

  module.exports = router;
	