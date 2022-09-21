const db = require("../utils/databse");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  findById(id) {
    db.execute("SELECT * FROM products where products.id = ?", [id]);
  }

  deleteById(id) {}
};

// module.exports = { Product };
