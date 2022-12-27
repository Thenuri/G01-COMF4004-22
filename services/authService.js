const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const accountController = require('../controllers/accountController');
const AccountModel = require('../models/accountModel');
const jwtService = require('./jwtService')

class AuthService { 

    static async signUp(req, res)  {

        // insert incomming json data to variables
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const accountType = req.body.accountType
    
        // check if email is valid
        const isValidEmail = emailValidator.validate(email);
        if (!isValidEmail) {
            return res.json({
                error: {message: "Email is not valid"}
            })
            
        }
    
        // check if password1 and 2 match
        if (password !== confirmPassword) {
            return res.json({
                error: {message: "Passwords do not match"}
            })
        
        }
        // check if password has enough length 
        const minLength = 10
        if (password.length < minLength - 1) {
        return res.json({ 
            error: { message: 'Password is shorter than ' + minLength + ' characters'}
        })        
        }

        // Check if account type field is valid
        const accountTypeList = ["client", "owner"]
        if (!(accountTypeList.includes(accountType))) {
            return res.json({error: { message: 'Account Type Error'}})
        }
    
        // check if account already exists for that email
        let existingAccount;
        try {
            existingAccount = await accountController.findAccountByEmail(email);

        } catch (error) {
            console.log(error)
            return res.json({
                message: "Error Occured"
            })
        }

        if (existingAccount !== undefined ) {
            return res.status(409).json({ 
                error: { message: 'Account already exists for that email'}
            })
        }
        
        // Hash password
        const hashed_password = await bcrypt.hash(password, 10)

        // add to db
        accountController.createAccount(email, hashed_password, accountType).then(            
            // TODO if create account success, create client or owner account
            result => {
                console.log(result)
                const account_id = result.insertId;

                // generate cookie with a jwt
                res = jwtService.generateCookieWithJWT(res, account_id, email)      
                
                res.status(201).json({
                    "message": "Account Created Successfully"
                })
            }
        ).catch( e => {
            console.log(e)
            return res.json({
                error: {
                            message: e.message
                        }
            })
        })
    }


    // 
    static async signIn (req, res) {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password
        
        let account;
        try {
            account = await accountController.findAccountByEmail(email)
            // console.log(account)
            
        }
        catch (e) {
            return res.status(500)
        }

        if (account === undefined) {
            return res.json({
                error: {
                    message: "Account not found"
                    // message: "Email Or Password is not valid"
                }
            })
            
        }


        // Check the password hashes
        const hashed_password = account.Password  // Hashed password in database
        const isValidPassword = await bcrypt.compare(password, hashed_password)
        
        if (isValidPassword) {

            console.log(isValidPassword, 'valid', hashed_password)
            // generate jwt token, add to a cookie and send 
            res = jwtService.generateCookieWithJWT(res, account.Account_ID, account.Email)    
            
            return res.status(200).json({
                    message: "success"
                    })     
        } else {

            return res.status(403).json( { 
                error: {
                    message: "Password not valid"
                    // message: "Email Or Password is not valid"
                }
            })

        }
    }
}

module.exports = AuthService