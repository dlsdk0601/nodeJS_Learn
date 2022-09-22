const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  "node-complete",
  "root",
  process.env.NODE_DBPASSWORD,
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;
