const {verifyJWTToken} = require('../services/jwtService.js')
const accountController = require('../controllers/accountController')
const ownerController = require('../controllers/ownerController');
const clientController = require('../controllers/clientController');

async function getProfileDetailsIfLoggedIn (req, res, next) {
    
    // this will change to true if the token is validated
    res.locals.logged = false;


    console.log("progiljbff")
    if (req.cookies === undefined) {
        console.log("No cookie")
        return next()
    }

    const {token} = req.cookies

    if (token === undefined) {
        console.log("No token")
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
            profile = {}
            profile.Name = "Admin"
        }
    } catch (error) {
        console.log(error)
        return next();
    }
    console.log( 'profile', profile)
    res.locals.logged = true
    res.locals.name = profile.Name;
    res.locals.profilePicture = profile.Profile_Picture;
    res.locals.accountType = accountType;

    next()
 }


module.exports =  getProfileDetailsIfLoggedIn