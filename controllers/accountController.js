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
    let accountType
    try {
        accountType = await this.findAccountTypeById(accountId);
    } catch (error) {
        throw error
    }
    
    if (accountType.toLowerCase() === 'client') {
        return true;
    } else {
        return false;
    }
}

exports.isOwnerAccount = async (accountId) => {
    let accountType;
    try {
        accountType = await this.findAccountTypeById(accountId);
    } catch (error) {
        throw error
    }
    
    if (accountType.toLowerCase() === 'owner') {
        return true;
    } else {
        return false;
    }
}

exports.isAdminAccount = async (accountId) => {
    let accountType;
    try {
        accountType = await this.findAccountTypeById(accountId);
    } catch (error) {
        throw error;
    }
    if (accountType.toLowerCase() === 'admin') {
        return true;
    } else {
        return false;
    }
}

exports.isAccountActive = async (accountId) => {
    let result;
    try {
        result = await Account.findAccountStatus(accountId);
    } catch (error) {
        throw error
    }

    const accountStatus = result.Account_Status.toLowerCase();
    if (accountStatus === 'active') {
        return true;
    } else {
        return false;
    }

}

exports.suspendAccount = async (req, res) => {
        const accountId = req.params.accountId;
        // console.log(req.body.AccountType)
        if (req.body.AccountType !== "admin") {
            res.status(403).json({error: {message: "Not Admin Account"}})
        }
        try {
            result = await Account.suspendAccount(accountId);

        } catch (error) {
            res.status(500)
        }
        
        return res.status(200).json({message: 'Account suspended'})

}

exports.activateAccount = async (req, res) => {
    const accountId = req.params.accountId;
    if (req.body.AccountType !== "admin") {
        res.status(403).json({error: {message: "Not Admin Account"}})
    }
    try {
        result = await Account.activateAccount(accountId);

    } catch (error) {
        res.status(500)
    }
    
    return res.status(200).json({message: 'Account activated'})
}