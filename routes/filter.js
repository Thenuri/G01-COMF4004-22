const express = require('express');
const { dbQuery } = require('../config/database');
const router = express.Router();
router.get('/finder',function(req,res){
    seatNo = req.body.seatNo
    price = req.body.price
    ac = req.body.ac
    let sort;
    let select;
    if (price === "low to high price"){
        select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?)  ORDER BY `Price_Per_km` ASC "
    }else if (price === "high to low price"){
        select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?)  ORDER BY `Price_Per_km` DESC "
    }
    /*let select = "SELECT * FROM `bus` where (? IS NULL OR `No_Of_Seats`= ?) AND (? IS NULL OR`AC_Status` = ?) AND ORDER BY `Price_Per_Km` ?"*/
    const values = [seatNo,seatNo,ac, ac];
    try {
        dbQuery(select, values).then( result => {
            // res.send(result)
            console.log(result)
        
        })
    }
    catch (error) {
        throw error
    }
});

module.exports = router;



