const mysql = require("mysql");

const connectionPool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "23102003",
  database: "livraria",
});

connectionPool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to the database:", error.message);
    console.error("SQL State:", error.sqlState);
    return;
  }
  console.log("Connected to the MySQL database!");

  // Release the connection
  connection.release();
});

connectionPool.on("error", (error) => {
  console.error("MySQL Pool Error:", error.message);
});

module.exports = connectionPool;
