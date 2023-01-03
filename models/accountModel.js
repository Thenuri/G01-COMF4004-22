const {database, dbQuery, dbQueryFetchFirstResult} = require('../config/database')

class AccountModel {

    static createAccount(email, hashed_password, accountType) {
        const sql = "INSERT INTO account (Email, Password, Account_type, Account_Status) VALUES (? , ? , ?, ?)";
        const values = [email, hashed_password, accountType, "active"];
        try {
            return dbQuery(sql, values)
        } 
        catch (error) {
            throw error
        }
        
    }
      
    static findAccountById(account_id) {
        const sql = "SELECT * FROM `account` WHERE Account_ID = ?";
        const values = [account_id]
        try {
            return dbQueryFetchFirstResult(sql, values)
        } 
        catch (error) {
            throw error
        }
    }

    static findAccountByEmail(email) {
        const sql = "SELECT * FROM `account` WHERE Email = ?"
        const values = [email]
        try {
            return dbQueryFetchFirstResult(sql, values)
        }
        catch (error) {
            throw error
        }
    }

    static findAccountTypeById(accountId) {
        const sql = "SELECT Account_Type FROM `account` WHERE Account_ID = ?"
        const values = [accountId]
        try {
            return dbQueryFetchFirstResult(sql, values)
        }
        catch (error) {
            throw error
        }
    }

    static findAccountStatus(accountId) {
        const sql = "SELECT Account_Status FROM `account` WHERE Account_ID = ?"
        const values = [accountId]
        try {
            return dbQueryFetchFirstResult(sql, values)
        }
        catch (error) {
            throw error
        }
    }

    static suspendAccount(accountId) {
        const sql = "UPDATE `account` SET `Account_Status` = 'suspended' WHERE `Account_ID` = ?"
        const values = [accountId]
        try {
            return dbQuery(sql, values);
        }
        catch (error) {
            throw error;
        }
    }

    static activateAccount(accountId) {
        const sql = "UPDATE `account` SET `Account_Status` = 'active' WHERE `Account_ID` = ?"
        const values = [accountId]
        try {
            return dbQuery(sql, values);
        }
        catch (error) {
            throw error;
        }
    }

 }

module.exports = AccountModel;

    // public methods to find account
    // static findAccountById(account_id) {
    //     db.query("SELECT * FROM `account` WHERE Account_ID = ?", [account_id], resultCallback)
    // }



        // static findAccountByEmail(email) {
    //     db.query("SELECT * FROM `account` WHERE Email = ?", [email], ( err, result) => {
    //         if (err) {
    //            return console.log(err)
    //         }
    //         else{
    //             return result
    //         }
    //     })

    // }

// function resultCallback( err, result) {
//     if (err) {
//        return console.log(err)
//     }
//     else{
//         return result
//     }
// }



    // static createAccount(email, hashed_password, accountType) {
    //     const sql = "INSERT INTO account (Email, Password, Account_type, Account_Status) VALUES (? , ? , ?, ?)"
    //     const values = [ email, hashed_password, accountType, "active" ]
    //     db.query(sql, values, (err, result) => {
    //         if (err) {
    //             throw err
    //         }
    //          else{
    //             console.log("yay")
    //             return result
    //         }
            
    //     })  
    // }