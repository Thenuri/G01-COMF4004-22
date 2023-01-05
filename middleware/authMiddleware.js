const {verifyJWTToken} = require('../services/jwtService.js')
const accountController = require('../controllers/accountController')

async function authenticateJWT (req, res, next) {

    if (req.cookies === undefined) {
        return res.json({
            error: {
                message: "No Cookies Found"
            }
        })
    }

    const {token} = req.cookies

    if (token === undefined) {
        return res.json({
            error: {
                message: "No Token Found"
            }
        })
    }
    let isValid
    // testtokenInvalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50X0lEIjoyRW1haWwiOiJxYWFkc2Z3QHR0LmNvbSIsImlhdCI6MTY3MjE0ODA3MiwiZXhwIjoxNjcyMTQ4NjcyfQ.n9BtTYYuOelvtTyemSw73V8JIY7HZqMCka6u73bpGVY'

    // testtokenExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50X0lEIjoyMywiRW1haWwiOiJxYWFkc2Z3QHR0LmNvbSIsImlhdCI6MTY3MjE0ODA3MiwiZXhwIjoxNjcyMTQ4NjcyfQ.n9BtTYYuOelvtTyemSw73V8JIY7HZqMCka6u73bpGVY'
    try {
        isValid = verifyJWTToken(token);
        // console.log(isValid)
    } catch (error) {
        console.log('authMiddleware error', error)
        return res.json({
            error: {
                message: error.message
            }
        })
        
    }

    // valid, therefore add to req.body
    const account_id = isValid.Account_ID;

    // check if the account is active
    let isAccountActive;
    try {
        isAccountActive = await accountController.isAccountActive(account_id);
        
    } catch (error) {
        console.log(error);
        res.status(500)
    }

    if ( !isAccountActive) {
        return res.status(403).json({ error:{ message : "Account not active / suspended"}})
    }
     
    let accountType;
    try {
        accountType = await accountController.findAccountTypeById(account_id)
        
    } catch (error) {
        console.log(error);
        res.status(500)
    }
    
    req.body.Account_ID = isValid.Account_ID;
    req.body.Email = isValid.Email
    req.body.AccountType = accountType;
    console.log(accountType)

    next();
}

module.exports = authenticateJWT