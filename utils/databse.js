const mysql = require("mysql2");
const env = require("dotenv");

env.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: process.env.NODE_DBPASSWORD,
});

module.exports = pool.promise();
