const Account= require('../models/accountModel')

exports.createAccount = async (email, hashed_password, accountType) => {
    try {
      const result = await Account.createAccount(email, hashed_password, accountType);
      return result;
    } 
    catch (err) {
      console.log(err.message)
      throw(err)
    }
};
  
exports.findAccountById = async (id) => {
    try {
        const result = await Account.findAccountById(id);
        return result;
        
    } 
    catch (err) {
        throw (err)
    }
    
}
exports.findAccountByEmail = async (email) => {
    try {
        const result = Account.findAccountByEmail(email)
        return result
    } 
    catch (err) {
        throw err
    }

}

exports.findAccountTypeById = async (accountId) => {
    try {
        const result = await Account.findAccountTypeById(accountId)
        return result.Account_Type;
    } 
    catch (err) {
        throw err
    }
}

exports.isClientAccount = async (accountId) => {
    const accountType = await this.findAccountTypeById(accountId);
    if (accountType.toLowerCase() === 'client') {
        return true;
    } else {
        return false;
    }
}

exports.isOwnerAccount = async (accountId) => {
    const accountType = await this.findAccountTypeById(accountId);
    if (accountType.toLowerCase() === 'owner') {
        return true;
    } else {
        return false;
    }
}

exports.isAdminAccount = async (accountId) => {
    const accountType = await this.findAccountTypeById(accountId);
    if (accountType.toLowerCase() === 'admin') {
        return true;
    } else {
        return false;
    }
}