const express = require('express');
const { dbQuery } = require('../config/database');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('VehiclePage');
})

router.get('/vehicleDe', (req, res) => {
    res.render('VehicleDetails');
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


module.exports = router;



