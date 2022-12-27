const mysql = require('mysql2/promise');

// DB connection as a pool
const database = mysql.createPool({
    host: "localhost",
    port: "3308",
    user: "root",
    password: "",
    database: "book-my-bus"
});


database.getConnection()
  .then(result => {
    console.log("DB Connection successfull");
  })
  .catch(err => {
    console.error(err);
  });

module.exports = database;




// const host = process.env.DB_HOST || "localhost";
// const port = process.env.DB_PORT || "3308";
// const user = process.env.DB_USER || "root";
// const password = process.env.DB_PASS || "";
// const db_name = process.env.DB_DATABASE || "book-my-bus";