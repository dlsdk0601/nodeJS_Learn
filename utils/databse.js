const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "node-complete",
  "root",
  process.env.NODE_DBPASSWORD,
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;
