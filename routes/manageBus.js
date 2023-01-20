const express = require('express');
const router = express.Router();
const { dbQuery } = require('../config/database');
const authenticateJWT = require('../middleware/authMiddleware');
const ownerController = require('../controllers/ownerController');
const getProfileDetailsIfLoggedIn = require('../middleware/getProfileDetailsIfLoggedIn');
const authMiddleware = require('../middleware/authMiddleware');
const { signUp } = require('../services/authService');

// Add a Bus
router.get('/',getProfileDetailsIfLoggedIn,authMiddleware, (req, res) => {
  if(accountType !== "owner"){
    res.redirect("signUp")
  }
  res.render('ManageBus');
})

// Update Bus
router.get('/update/:id',getProfileDetailsIfLoggedIn,authMiddleware, (req, res) => {
  if(accountType !== "owner"){
    res.redirect("signUp")
  }
  res.render('UpdateBus');
})

// Change patch to put in the JS
router.put('/addBus',authenticateJWT,async function(req, res, next) {
    const Account_ID = req.body.Account_ID;
    const Bus_No = req.body.Bus_No;
    const No_Of_Seats = req.body.No_Of_Seats;
    const Price_Per_km = req.body.Price_Per_km;
    const AC_Status = req.body.AC_Status;
    const Driver_Name = req.body.Driver_Name;
    const Bus_Image = req.body.Bus_Image;

    console.log("wada",Bus_Image)

// TODO get account id using jwtAuth middleware, find owner id and Add owner id to query , 
    owner = await ownerController.findOwnerByAccountId(Account_ID);
    const sql = "INSERT INTO bus (Owner_ID, Bus_No, No_Of_Seats, Price_Per_km, Bus_Availability, AC_Status, Driver_Name, Bus_Image) VALUES (?,?,?,?,?,?,?, ?)";
    const values = [owner.Owner_ID,Bus_No,No_Of_Seats,Price_Per_km,'available',AC_Status,Driver_Name, Bus_Image];

    
      dbQuery(sql, values)
      .then((result) => {
        console.log(result)
        res.send("Successful")
      })
      .catch( (error) => {
        res.status(500).send(error)
      })
})

// Auto fill the bus details in the update bus form
router.get("/BusFill/:id",authenticateJWT , async function(req,res){
  const busid = req.params.id
  const Account_ID = req.body.Account_ID;
  const Account_Type = req.body.AccountType;
  console.log('auth', accountId, accountType)
  let getData, values, result;

  if (Account_Type === "owner"){
      owner = await ownerController.findOwnerByAccountId(Account_ID);
      console.log(owner)
       getData = "SELECT * FROM `bus` WHERE `Bus_ID`=? AND `Owner_ID`=?"
       values = [busid,owner.Owner_ID]
       try {
        dbQuery(getData, values).then(result =>{return res.json(result)})
      }
      catch (error) {
        throw error
      }
  }else if (Account_Type === "client"){
    return res.status(403).json({error: {message: "Not allowed to update Bus"}})
  }else{
    return res.status(403).json({error: {message: "Account type not valid"}})
  }
 
})

// Update bus form 
router.patch("/BusUpdate", authenticateJWT, async function(req,res){
  const busID = req.body.Bus_ID;
  const Bus_No = req.body.Bus_No;
  const No_Of_Seats = req.body.No_Of_Seats;
  const Price_Per_km = req.body.Price_Per_km;
  const AC_Status = req.body.AC_Status;
  const Driver_Name = req.body.Driver_Name;
  const Account_ID = req.body.Account_ID;
  const Account_Type = req.body.Account_Type;
  const Bus_Image = req.body.Bus_Image
  let updates, values;

  if (Account_Type === "owner"){
      owner_ac = await ownerController.findOwnerByAccountId(Account_ID);
      console.log(owner_ac)
      updates = "UPDATE `bus` SET `Bus_No` = ? , `No_Of_Seats` = ? , `Price_Per_km` = ? , `Driver_Name` = ? , `AC_Status` = ? , `Bus_Image`= ? WHERE `Bus_ID` = ?";
      values = [Bus_No, No_Of_Seats, Price_Per_km, Driver_Name, AC_Status, Bus_Image ,busID]
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

// View Vehicle Details
router.get('/BusDetails', function(req, res, next){
  const Bus_ID = req.body.Bus_ID;
  const sql = "SELECT Bus_No, No_Of_Seats, AC_Status, Price_Per_km, Driver_Name FROM `bus` WHERE Bus_ID = ?";
  const values = [Bus_ID]
  try{
      return dbQuery(sql,values).then(res.send("Succesfull"))
  }
  catch (error){

      throw error
  }
})

router.get('/OwnedBuses', authenticateJWT, async function(req, res, next){
  const accountId = req.body.Account_ID;
  const accountType = req.body.AccountType;
  
  let values,getbus;
  if(accountType === "owner"){
    
    try{
      owner = await ownerController.findOwnerByAccountId(accountId);
      console.log(owner)
    }
    catch (error){

      throw error
    }
    values = [owner.Owner_ID]
    console.log(values)
    getbus = "SELECT * FROM `bus` WHERE `bus`.`Owner_ID`= ?"
    console.log(getbus)
    try{
      dbQuery(getbus,values).then(result =>{return res.json(result)});
      
    }
    catch (error){

      throw error
    }
  }else{
    return res.send("hi")
  }
})

module.exports = router;
	