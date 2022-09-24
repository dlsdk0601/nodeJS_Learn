import Sequelize from "sequelize";
import db from "../utils/databse.js";

const Cart = db.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default Cart;
