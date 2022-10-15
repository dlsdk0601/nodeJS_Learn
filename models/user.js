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
    const cartProductIndex = this.cart.items.findIndex((item) => {
      return item._id.toString() === product._id.toString();
    });

    // 이미 장바구니에 존재
    if (cartProductIndex >= 0) {
      quantity = this.cart.items[cartProductIndex].quantity + 1;
      updateCartItem[cartProductIndex].quantity = quantity;
    } else {
      updateCartItem.push({
        _id: new mongodb.ObjectId(product._id),
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

  getCart() {
    const db = mongoConnect.getDB();

    const productIds = this.cart.items.map((item) => item._id);

    // find로 하나의 상품만 찾는게 아니라, $in을 사용하여 id가 모인 배열들 통해 모든 상품을 다 찾음
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item._id.toString() === product._id.toString()
            ).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(_id) {
    const db = mongoConnect.getDB();
    const updateCartItems = this.cart.items.filter(
      (item) => item._id.toString() !== _id.toString()
    );
    return db.collection("users").updateOne(
      {
        _id: new ObjectId(this._id),
      },
      { $set: { cart: { items: updateCartItems } } }
    );
  }

  addOrder() {
    const db = mongoConnect.getDB();
    return db
      .collection("orders")
      .insertOne(this.cart)
      .then((result) => {
        this.cart = { item: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: this.cart } }
          );
      });
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
