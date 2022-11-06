import Product from "../models/product.js";
import Order from "../models/order.js";

const getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        isAuthenticated: req.session.isLogged,
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLogged,
        csrfToken: req.csrfToken(), // csrfToken 매서드는 미들웨어에 의해 추가된다. app.js 참고
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (req, res) => {
  req.user
    .populate("cart.items.productId") // cart 객체를 반환한다.
    .then((user) => {
      const products = [...user.cart.items];
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products,
        isAuthenticated: req.session.isLogged,
      });
    })
    .catch((err) => console.log(err));
};

const postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

const getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders,
        pageTitle: "Your Orders",
        path: "/orders",
        isAuthenticated: req.session.isLogged,
      });
    })
    .catch((err) => console.log(err));
};

const getProduct = (req, res) => {
  const prodId = req.params.productId;
  // mongoose에 findById라는 함수가 내장돼잇음
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        prd: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLogged,
      });
    })
    .catch((err) => console.log(err));
};

const postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

const postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, productData: { ...item.productId } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user, // user 전체를 넘기면 mongoose가 Id를 받아온다.
        },
        products,
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

export default {
  getProducts,
  getIndex,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
};
