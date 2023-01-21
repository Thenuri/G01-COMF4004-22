const jwt = require('jsonwebtoken')
require('dotenv').config()

// to generate string for JWT_SECRET
// run node in terminal, generate token with the following
// require('crypto').randomBytes(64).toString('hex')
// ref: https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

function generateJWTToken(Account_ID, Email, AccountType) {
    const accountDetails = {
        Account_ID: Account_ID,
        Email: Email,
        AccountType: AccountType
    }

    try {
        return jwt.sign(accountDetails, process.env.JWT_SECRET, {
            expiresIn: 30 * 60 // 30 min denoted in secounds
    
        })
    } catch (e) {
        console.log(e.message)
    }
    
}


exports.verifyJWTToken = (token) => {
    // returns object with Account_ID and Email if valid, throws error if expired, or invalid
    try {
        const isValid =  jwt.verify(token, process.env.JWT_SECRET)
        if (isValid) {
            return isValid; // contains account detail json
            /* eg:
            {
                Account_ID: 23,
                Email: 'qaadsfw@tt.com',
                AccountType: 'client',
                iat: 1672148072,
                exp: 1672148672
            }
                */
        }
        console.log(isValid, 'notvalid')

    } catch (e) {
        console.log(e.message)
        throw e;
    }
    
}


exports.generateCookieWithJWT = (res, Account_ID, Email, AccountType) => {
    // generates jwt, adds it to a cookie in the res, and returns the res

    token = generateJWTToken(Account_ID, Email, AccountType)
    res.cookie("token", token, {
        secure: true,
        httpOnly: true,
        maxAge: 30 * 60 * 1000 // 30 mins, given in ms, multiplication is to break it down for redability
                    // 30min * 60s * 1000ms
    })
    return res
    
}
