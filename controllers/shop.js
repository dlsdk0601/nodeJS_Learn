import Product from "../models/product.js";

const getProducts = (_, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

const getIndex = (_, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products,
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
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        orders,
        pageTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
};

const getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        prd: product.dataValues,
        pageTitle: product.dataValues.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

const postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

const postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
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
