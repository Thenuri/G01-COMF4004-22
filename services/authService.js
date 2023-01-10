const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const accountController = require('../controllers/accountController');
const clientController = require('../controllers/clientController')
const ownerController = require('../controllers/ownerController')

const jwtService = require('./jwtService')

class AuthService { 

    static async signUp(req, res)  {

        
        //  Expected JSON format
        /*
            {
                "email": "John@example.com",
                "password": "test1234567890",
                "confirmPassword" : "test1234567890",
                "accountType" : "client", 
                "details" : {
                    "name" : "John",
                    "address": "123 Fake St",
                    "contactNo": "0123456790",
                    "profilePhoto": "imageBlob"
                }
            }

            */   

        // insert incomming json data to variables
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const accountType = req.body.accountType.toLowerCase();
        const name = req.body.details.name;
        const address = req.body.details.address;
        const contactNo = req.body.details.contactNo;
        const profilePhoto = req.body.details.profilePhoto;
    
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
        const accountTypeList = ["client", "owner" , "admin"]    // , "admin"
        if (!(accountTypeList.includes(accountType))) {
            return res.json({error: { message: 'Account Type Error'}})
        }
    
        // check if account already exists for that email
        let existingAccount;
        try {
            existingAccount = await accountController.findAccountByEmail(email);

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Error Occured"
            })
        }

        if (existingAccount !== undefined ) {
            return res.status(409).json({ 
                error: { message: 'Account already exists for that email'}
            })
        }
        

        // check if details are provided
        if (name === undefined) {
            return res.json({ error: {message: "Enter your name"}})
        }

        if (address === undefined) return res.json({ error: {message: "Enter your address"}})

        if (contactNo === undefined) return res.json({ error: {message: "Enter your Contact No"}})

        // TODO check for profile photo later


        // Hash password
        const hashed_password = await bcrypt.hash(password, 10)

        // add to db
        accountController.createAccount(email, hashed_password, accountType).then(            
            // TODO if create account success, create client or owner account
            result => {
                console.log(result)
                const account_id = result.insertId;

                // Create Client and Owner account
                try {
                    switch (accountType) {
                        case 'client':
                            clientController.createClient(account_id, name, address, contactNo, profilePhoto);
                            break;
                        
                        case 'owner':
                            ownerController.createOwner(account_id, name, address, contactNo, profilePhoto);                        
                            break;
                    
                        default:
                            res.json({error: { message: "Error Creating account type"}})
                            break;
                    }
                } catch (error) {
                    res.json({error: { message: "Error Creating account type"}});
                }

                

                // generate cookie with a jwt
                res = jwtService.generateCookieWithJWT(res, account_id, email, accountType)      
                
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
            return res.status(403).json({
                error: {
                    message: "Account not found"
                    // message: "Email Or Password is not valid"
                }
            })
            
        }

        if (account.Account_Status !== "active") {
            return res.status(403).json({
                error: {
                    message: "Account not active / suspended"
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
            res = jwtService.generateCookieWithJWT(res, account.Account_ID, account.Email, account.Account_Type)       

            let redirect = req.query.redirect || '/';
            res.redirect(redirect);
            // res.send("singin")
            return;
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