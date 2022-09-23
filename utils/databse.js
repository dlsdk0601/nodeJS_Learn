import Sequelize from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize(
  "node-complete",
  "root",
  process.env.NODE_DBPASSWORD,
  { dialect: "mysql", host: "localhost" }
);

export default sequelize;
