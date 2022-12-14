const {verifyJWTToken} = require('../services/jwtService.js')
const accountController = require('../controllers/accountController')

async function authenticateJWT (req, res, next) {

    // if an api request is done without signing in, the redirection after signin should go to
    // the referer site ( the page that the api request was done)
    if (req.headers.referer) {
        if(req.headers.referer !== req.originalUrl) {
            req.originalUrl = req.headers.referer;
        }
    }

    if (req.cookies === undefined) {
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
        // .json({
        //     error: {
        //         message: "No Cookies Found"
        //     }
        // })
    }

    const {token} = req.cookies

    if (token === undefined) {
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
        // .json({
        //     error: {
        //         message: "No Token Found"
        //     }
        // })
    }
    let isValid
    // testtokenInvalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50X0lEIjoyRW1haWwiOiJxYWFkc2Z3QHR0LmNvbSIsImlhdCI6MTY3MjE0ODA3MiwiZXhwIjoxNjcyMTQ4NjcyfQ.n9BtTYYuOelvtTyemSw73V8JIY7HZqMCka6u73bpGVY'

    // testtokenExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50X0lEIjoyMywiRW1haWwiOiJxYWFkc2Z3QHR0LmNvbSIsImlhdCI6MTY3MjE0ODA3MiwiZXhwIjoxNjcyMTQ4NjcyfQ.n9BtTYYuOelvtTyemSw73V8JIY7HZqMCka6u73bpGVY'
    try {
        isValid = verifyJWTToken(token);
        // console.log(isValid)
    } catch (error) {
        console.log('authMiddleware error', error)
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
        
    }

    // valid, therefore add to req.body
    const account_id = isValid.Account_ID;

    // check if the account is active
    let isAccountActive;
    try {
        isAccountActive = await accountController.isAccountActive(account_id);
        
    } catch (error) {
        console.log(error);
        return res.status(500)
    }

    if ( !isAccountActive) {
        return res.status(403).redirect('/signin?redirect=' + req.originalUrl);
        // .json({ error:{ message : "Account not active / suspended"}})
    }
     
    let accountType;
    try {
        accountType = await accountController.findAccountTypeById(account_id)
        
    } catch (error) {
        console.log(error);
        return res.status(500)
    }
    
    req.body.Account_ID = isValid.Account_ID;
    req.body.Email = isValid.Email
    req.body.AccountType = accountType;
    console.log(accountType)

    next();
}

module.exports = authenticateJWT