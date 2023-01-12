const {verifyJWTToken} = require('../services/jwtService.js')
const accountController = require('../controllers/accountController')
const ownerController = require('../controllers/ownerController');
const clientController = require('../controllers/clientController');
const { findOwnerByAccountId } = require('../controllers/ownerController.js')
const { findClientByAccountId } = require('../controllers/clientController.js')

async function getProfileDetailsIfLoggedIn (req, res, next) {
    
    console.log("progiljbff")
    if (req.cookies === undefined) {
        return next()
    }

    const {token} = req.cookies

    if (token === undefined) {
        return next()
    }
    let isValid

    try {
        isValid = verifyJWTToken(token);
        
    } catch (error) {
        console.log(error)
        return next();
        
    }

    accountId = isValid.Account_ID;
    email = isValid.Email
    accountType =await accountController.findAccountTypeById(isValid.Account_ID)

    console.log(accountId, email, accountType)
    // get name profile pic
    let profile;
    try {
        if (accountType === "owner") {
            profile = await ownerController.findOwnerByAccountId(accountId);
            
        } else if (accountType === "client") {
            profile = await clientController.findClientByAccountId(accountId);

        } else if (accountType === "admin") {
            profile.name = "Admin"
        }
    } catch (error) {
        console.log(error)
        return next();
    }
    console.log( 'profile', profile)

    res.locals.logged = true
    res.locals.name = profile.Name;
    res.locals.profilePicture = profile.Profile_Picture;

    next()
 }


module.exports =  getProfileDetailsIfLoggedIn