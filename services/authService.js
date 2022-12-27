const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const accountController = require('../controllers/accountController');
const AccountModel = require('../models/accountModel');

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
        try {
            const [existingAccountsRow] = await accountController.findAccountByEmail(email);

            if (existingAccountsRow.length !== 0 ) {
                return res.json({ 
                    error: { message: 'Account already exists for that email'}
                })
            }

        } catch (error) {
            console.log(error)
            return res.json({
                message: "Error Occured"
            })
        }
              
        
        // Hash password
        const hashed_password = await bcrypt.hash(password, 10)

        // add to db
        accountController.createAccount(email, hashed_password, accountType).then(            
            // TODO if create account success, create client or owner account
            result => {
                const account_id = result[0].insertId;
                
                res.status(201).json({
                    "message": "Account Created Successfully"
                })
            }
        );
    }

    static async signIn (req, res) {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password
        let account;
        try {
            [account] = await AccountModel.findAccountByEmail(email)
            if (account.length === 0) {
                return res.json({
                    error: {
                        message: "Account not found"
                    }
                })
            }
        }
        catch (e) {
            return res.status(500)
        }

        const hashed_password = account[0].hashed_password
        const isValidPassword = await bcrypt.compare(password, hashed_password)
        if (isValidPassword) {
            // generate jwt token, add to a cookie and send 
            
        }
        
        
    }

}
module.exports = AuthService