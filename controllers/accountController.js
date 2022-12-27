const Account= require('../models/accountModel')

exports.createAccount = async (email, hashed_password, accountType) => {
    try {
      const result = await Account.createAccount(email, hashed_password, accountType);
      return result;
    } catch (err) {
      throw err;
    }
};
  
exports.findAccountById = async (id) => {
    try {
        const result = await Account.findAccountById(id);
        return result;
        
    } catch (err) {
        throw (err)
    }
    
}
exports.findAccountByEmail = async (email) => {
    try {
        const result= await Account.findAccountByEmail(email)
        return result
    } 
    catch (err) {
        throw err
    }

}