import mongodb from "mongodb";
import mongoConnect from "../utils/databse.js";

const ObjectId = mongodb.ObjectId;

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = mongoConnect.getDB();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // -1이 나오면 없는 상품
    // const cartProduct = this.cart.items.findIndex(
    //   (item) => item._id === product._id
    // );
    const db = mongoConnect.getDB();
    const updateCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }],
    };
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updateCart } }
      );
  }

  static findById(userId) {
    const db = mongoConnect.getDB();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

export default User;
