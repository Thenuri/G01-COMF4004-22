const Client = require('../models/clientModel')

exports.createClient = async (Account_ID, Name, Address, Contact_No, Profile_Picture)  => {

    try {
      const result = await Client.createClient(Account_ID, Name, Address, Contact_No, Profile_Picture);
      return result;
    } 
    catch (err) {
      console.log(err.message)
      throw(err)
    }
};
  
exports.findCilentByClientId = async (clientId) => {

    try {
        const result = await Client.findClientByClientId(clientId)
        return result;
        
    } 
    catch (err) {
        throw (err)
    }
    
}
exports.findClientByAccountId = async (accountId) => {
    try {
        const result = Client.findClientByAccountId(accountId)
        return result
    } 
    catch (err) {
        throw err
    }

}