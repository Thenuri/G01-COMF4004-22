const Owner = require('../models/ownerModel')

exports.createOwner = async (Account_ID, Name, Address, Contact_No, Profile_Picture)  => {

    try {
      const result = await Owner.createOwner(Account_ID, Name, Address, Contact_No, Profile_Picture);
      return result;
    } 
    catch (err) {
      console.log(err.message)
      throw(err)
    }
};
  
exports.findOwnerByOwnerId = async (ownerId) => {

    try {
        const result = await Owner.findOwnerByOwnerId(ownerId)
        return result;
        
    } 
    catch (err) {
        throw (err)
    }
    
}
exports.findOwnerByAccountId = async (accountId) => {
    try {
        const result = Owner.findOwnerByAccountId(accountId)
        return result
    } 
    catch (err) {
        throw err
    }

}