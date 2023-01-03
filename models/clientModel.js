const {database, dbQuery, dbQueryFetchFirstResult} = require('../config/database')

class ClientModel {

    static createClient(Account_ID, Name, Address, Contact_No, Profile_Picture) {
        const sql = "INSERT INTO client (Account_ID, Name, Address, Contact_No, Profile_Picture) VALUES (? , ? , ?, ?, ?)";
        const values = [Account_ID, Name, Address, Contact_No, Profile_Picture];
        try{
            return dbQuery(sql, values)
        } 
        catch (error) {
            throw error
        }        
    }

    static findClientByAccountId(account_id) {
        const sql = "SELECT * FROM `client` WHERE Account_ID = ?";
        const values = [account_id]
        try {
            return dbQueryFetchFirstResult(sql, values)
        } 
        catch (error) {
            throw error
        }
    }

    static findClientByClientId(Client_ID) {
        const sql = "SELECT * FROM `client` WHERE Client_ID = ?";
        const values = [Client_ID]
        try {
            return dbQueryFetchFirstResult(sql, values)
        } 
        catch (error) {
            throw error
        }
    }

}

module.exports = ClientModel