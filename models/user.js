import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
    return item.productId.toString() !== productId.toString();
  });

  this.cart.items = updateCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
