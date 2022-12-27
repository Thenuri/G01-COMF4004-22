const db = require('../config/database')

class AccountModel {



    static createAccount(email, hashed_password, accountType) {
        const sql = "INSERT INTO account (Email, Password, Account_type, Account_Status) VALUES (? , ? , ?, ?)";
        const values = [email, hashed_password, accountType, "active"];
        return db.query(sql, values);
    }
      

    // public methods to find account
    // static findAccountById(account_id) {
    //     db.query("SELECT * FROM `account` WHERE Account_ID = ?", [account_id], resultCallback)
    // }

    static findAccountById(account_id) {
        const sql = "SELECT * FROM `account` WHERE Account_ID = ?";
        const values = [account_id]
        return db.query(sql, values)
    }

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

    static findAccountByEmail(email) {
        const sql = "SELECT * FROM `account` WHERE Email = ?"
        const values = [email]
        return db.query(sql, values)
    }


 }

module.exports = AccountModel;

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