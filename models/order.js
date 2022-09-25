import Sequelize from "sequelize";
import db from "../utils/databse.js";

const Order = db.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default Order;
