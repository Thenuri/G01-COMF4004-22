const {database, dbQuery, dbQueryFetchFirstResult} = require('../config/database')

class OwnerModel {

    static createOwner(Account_ID, Name, Address, Contact_No, Profile_Picture) {
        const sql = "INSERT INTO bus_owner (Account_ID, Name, Address, Contact_No, Profile_Picture) VALUES (? , ? , ?, ?, ?)";
        const values = [Account_ID, Name, Address, Contact_No, Profile_Picture];
        try{
            return dbQuery(sql, values)
        } 
        catch (error) {
            throw error
        }        
    }

    static findOwnerByAccountId(account_id) {
        const sql = "SELECT * FROM `bus_owner` WHERE Account_ID = ?";
        const values = [account_id]
        try {
            return dbQueryFetchFirstResult(sql, values)
        } 
        catch (error) {
            throw error
        }
    }

    static findOwnerByOwnerId(Owner_ID) {
        const sql = "SELECT * FROM `bus_owner` WHERE Owner_ID = ?";
        const values = [Owner_ID]
        try {
            return dbQueryFetchFirstResult(sql, values)
        } 
        catch (error) {
            throw error
        }
    }

}

module.exports = OwnerModel