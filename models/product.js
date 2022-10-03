import mongoConnect from "../utils/databse.js";

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  save() {
    const db = mongoConnect.getDB();
    return db
      .collection("products")
      .insertOne(this)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}

const Product = sequelize.define("product", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: STRING,
  price: {
    type: DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: false,
  },
});

export default Product;
