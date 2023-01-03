const express = require('express');
const router = express.Router();
const db=require('../config/database');


/* GET ManageBus page. */
router.get('/', function(req, res, next) {
    res.render('ManageBus', { title: 'Add-A-Bus' });
  });

  router.post('/save', function(req, res, next) {
    var Bus_No = req.body.Bus_No;
    var No_Of_Seats = req.body.No_Of_Seats;
    var Price_Per_km = req.body.Price_Per_km;
    var Value = req.body.Value;
    var Driver_Name = req.body.Driver_Name;
    var sql = `INSERT INTO bus (Bus_No, No_Of_Seats, Price_Per_km, Value) VALUES ("${Bus_No}", "${No_Of_Seats}", "${Price_Per_km}", "${Value}")`;
    var sql = `INSERT INTO bus_driver (Driver_Name) VALUES ("${Driver_Name}")`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      req.flash('success', 'Data added successfully!');
      res.redirect('/');
    });
  });
  module.exports = router;
	