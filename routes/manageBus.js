const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');
const authenticateJWT = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');


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

/*Auto fill the bus details in the update bus form*/ 
router.get("/BusFill",authenticateJWT , async function(req,res){
  const Account_ID = req.body.Account_ID;
  const Account_Type = req.body.Account_Type;
  console.log('auth', accountId, accountType)
  let getData, values;

  if (Account_Type === "owner"){
      owner = await ownerController.findOwnerByAccountId(Account_ID);
      console.log(owner)
      getData = "SELECT "
  }
})

/*Update bus form*/ 
router.put("/BusUpdate", authenticateJWT, async function(req,res){
  const Bus_No = req.body.Bus_No;
  const No_Of_Seats = req.body.No_Of_Seats;
  const Price_Per_km = req.body.Price_Per_km;
  const AC_Status = req.body.AC_Status;
  const Driver_Name = req.body.Driver_Name;
  const Account_ID = req.body.Account_ID;
  const Account_Type = req.body.Account_Type;
  let updates, values;

  if (Account_Type === "owner"){
      owner_ac = await ownerController.findOwnerByAccountId(Account_ID);
      console.log(owner_ac)
      updates = "UPDATE `bus` SET `Bus_No` = ? , `No_Of_Seats` = ? , `Price_Per_km` = ? , `Driver_Name` = ? , `AC_Status` = ? WHERE `Bus_No` = ?";
      values = [Bus_No, No_Of_Seats, Price_Per_km, Driver_Name, AC_Status]
  }else {
      return res.json({error: {message: "Not allowed to update the bus"}})
  }
  try{
      dbQuery(updates, values).then(res.send("Bus details has been updated!"))
  }
  catch (error) {
      throw error
  }     
  
})

/*View Vehicle Details*/
router.get('/BusDetails', function(req, res, next){
  const Bus_ID = req.body.Bus_ID;
  const sql = "SELECT Bus_No, No_Of_Seats, AC_Status, Price_Per_km, Driver_Name FROM `bus` WHERE Bus_ID = ?";
  const values = [Bus_ID]
  try{
      return dbQuery(sql,values).then(res.send("Succesfull"))
  }
  catch (error){

      throw error
  }
})


  module.exports = router;
	