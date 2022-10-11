import mongodb from "mongodb";
import mongoConnect from "../utils/databse.js";

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }
  save() {
    const db = mongoConnect.getDB();
    let dbOp;
    if (this._id) {
      // update
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
      //$set 으로 option을 줄수 있음, 어떻게 업데이트 할건지, 현재는 this 자체를 save하기에 this를 모두 다시 저장하는 로직
    } else {
      dbOp = db
        .collection("products")
        .insertOne(this)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
    return dbOp;
  }

  static fetchAll() {
    const db = mongoConnect.getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = mongoConnect.getDB();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: STRING,
//   price: {
//     type: DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: STRING,
//     allowNull: false,
//   },
//   description: {
//     type: STRING,
//     allowNull: false,
//   },
// });

export default Product;
