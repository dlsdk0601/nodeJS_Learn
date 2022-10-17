import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// userModel에는 직접 addTocart를 작성했지만, 여기서는 userSchema에 methods로 로직을 추가할수있다.
userSchema.methods.addToCart = function (product) {
  let quantity = 1;
  const updateCartItem = [...this.cart.items];
  const cartProductIndex = this.cart.items.findIndex((item) => {
    return item.productId.toString() === product._id.toString();
  });

  // 이미 장바구니에 존재
  if (cartProductIndex >= 0) {
    quantity = this.cart.items[cartProductIndex].quantity + 1;
    updateCartItem[cartProductIndex].quantity = quantity;
  } else {
    updateCartItem.push({
      productId: product._id,
      quantity,
    });
  }
  const updateCart = {
    items: updateCartItem,
  };

  this.cart = updateCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updateCartItems = this.cart.items.filter((item) => {
    console.log("item==");
    console.log(item);
    console.log("productId==");
    console.log(productId);
    return item.productId.toString() !== productId.toString();
  });

  console.log("updateCartItems===");
  console.log(updateCartItems);

  this.cart.items = updateCartItems;
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(userName, email, cart, id) {
//     this.name = userName;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = mongoConnect.getDB();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     // -1이 나오면 없는 상품
//     let quantity = 1;
//     const updateCartItem = [...this.cart.items];
//     const cartProductIndex = this.cart.items.findIndex((item) => {
//       return item._id.toString() === product._id.toString();
//     });

//     // 이미 장바구니에 존재
//     if (cartProductIndex >= 0) {
//       quantity = this.cart.items[cartProductIndex].quantity + 1;
//       updateCartItem[cartProductIndex].quantity = quantity;
//     } else {
//       updateCartItem.push({
//         _id: new mongodb.ObjectId(product._id),
//         quantity,
//       });
//     }
//     const db = mongoConnect.getDB();
//     const updateCart = {
//       items: updateCartItem,
//     };
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updateCart } }
//       );
//   }

//   getCart() {
//     const db = mongoConnect.getDB();
//     const productIds = this.cart.items.map((item) => item._id);

//     // find로 하나의 상품만 찾는게 아니라, $in을 사용하여 id가 모인 배열들 통해 모든 상품을 다 찾음
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item._id.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }

//   deleteItemFromCart(_id) {
//     const db = mongoConnect.getDB();
//     const updateCartItems = this.cart.items.filter(
//       (item) => item._id.toString() !== _id.toString()
//     );
//     return db.collection("users").updateOne(
//       {
//         _id: new ObjectId(this._id),
//       },
//       { $set: { cart: { items: updateCartItems } } }
//     );
//   }

//   addOrder() {
//     const db = mongoConnect.getDB();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: this.cart } }
//           );
//       });
//   }

//   getOrders() {
//     const db = mongoConnect.getDB();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) }) // orders 모델안에 user값이 있고 그안에 _id가 있기때문에, "" 안에 경로 처럼 적어줘야함
//       .toArray();
//   }

//   static findById(userId) {
//     const db = mongoConnect.getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// export default User;
