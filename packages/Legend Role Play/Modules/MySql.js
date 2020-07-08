const mysql = require("mysql");
const config = require("../config.json");

const connection = mysql.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
});

connection.getConnection((error) => {
  if (error) {
    switch (error.code) {
      case "ENOTFOUND":
        console.log(
          "[DATABASE]: Check database config, or make sure your MySQL server is runnning."
        );
        break;
      case "ER_BAD_DB_ERROR":
        console.log("[DATABASE]: Database name is not exist");
        break;
      case "ER_ACCESS_DENIED_ERROR":
        console.log("[DATABASE]: Username or password incorrect");
        break;
      case "ENOENT":
        console.log("[DATABASE]: No internet connection, or server down");
        break;
      default:
        console.log(`[DATABASE]: Error ${error.code}`);
        break;
    }
  } else {
    console.log("[DATABASE]: Success database connection");
  }
});

module.exports = connection;
