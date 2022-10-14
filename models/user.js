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
    let quantity = 1;
    const updateCartItem = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex(
      (item) => item._id.toString() === product._id.toString()
    );

    // 이미 장바구니에 존재
    if (cartProductIndex >= 0) {
      quantity = this.cart.items[cartProductIndex].quantity + 1;
      updateCartItem[cartProductIndex].quantity = quantity;
    } else {
      updateCartItem.push({
        productId: new ObjectId(product._id),
        quantity,
      });
    }
    const db = mongoConnect.getDB();
    const updateCart = {
      items: updateCartItem,
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
