const express = require('express');
const router = express.Router();
      
router('/finder/:id',function(req,res,next){
    seatNo = req.body.seatNo
    price = req.body.price
    sort
    ac = req.body.ac

    let select = "SELECT * FROM `bus` where `No_Of_Seats`= seatNo AND `AC_Status` = ac AND ORDER BY `Price_Per_Km` ="

})




