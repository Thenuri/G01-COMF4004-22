const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASS || "";
const db_name = process.env.DB_DATABASE || "book-my-bus";

// DB connection as a pool
const database = mysql.createPool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: db_name
});


database.getConnection()
  .then(console.log("DB Connection successfull"))
  .catch(err => {
    console.error(err);
  });


// Custom query function to get only the rows, (excluding fields metadata)
async function dbQuery( sql, values) {
  try {
    const [rows] = await database.query(sql, values);
    return rows;
  } 
  catch (error) {
    throw error;
  }
}

// Custom function to get *only the first item* in the result row
async function dbQueryFetchFirstResult(sql, values) {
  try {
    result = await dbQuery(sql, values)
    return result[0] // return first object
    
  } catch (error) {
    throw error
  }
}

module.exports = {
  database,
  dbQuery,
  dbQueryFetchFirstResult
};


