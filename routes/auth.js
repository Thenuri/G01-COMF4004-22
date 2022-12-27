const express = require('express');
const router = express.Router();
const authService = require('../services/authService')
const jwt = require('jsonwebtoken')

// Routes
router.post('/signin', authService.signIn);

router.post('/signup', authService.signUp)

module.exports = router;


// (req, res) => {

//   // insert incomming json data to variables
//   const email = req.body.email
//   const password = req.body.password
//   const confirmPassword = req.body.confirmPassword
//   const accountType = req.body.accountType

//   console.log()

//   // TODO check if they are all strings ( to check if they are not empty)

//   // check if email is in correct format
//   isValidEmail = emailValidator.validate(email);

//   if (!isValidEmail) res.json({
//   error: {message: "Email is not valid"}
//   })

//   // check if password1 and 2 match
//   if (password !== confirmPassword) {
//   res.json({
//       error: {message: "Passwords do not match"}
//   })
//   }
//   // check if password has enough length 
//   const minLength = 10
//   if (password.length < minLength - 1) {
//   res.json({ 
//       error: { message: 'Password is shorter than ' + minLength + ' characters'}
//   })
//   }

//   // check if account exists for email
  

//   // add to db



//   // if create account success, create client, owner account
//   // res.send('singup route');

//   // res.send(isValidEmail));
