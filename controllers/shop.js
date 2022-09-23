import Product from "../models/product.js";
import Cart from "../models/cart.js";

const getProducts = (_, res) => {
  Product.findAll()
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
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

const getCart = (_, res) => {
  const productModel = new Product();
  Cart.getCart((cart) => {
    productModel.fetchAll((products) => {
      const cartProducts = [];
      for (let i = 0; i < products.length; i++) {
        const cartProductData = cart.products.find(
          (item) => item.id === products[i].id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: products[i],
            qty: cartProductData.qty,
          });
        }
      }
      console.log("cartProducts==");
      console.log(cartProducts);
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res) => {
  const prodId = req.body.productId;
  const productModel = new Product();
  productModel.findById(prodId, (prd) => {
    Cart.addProduct(prodId, prd.price);
  });
  res.redirect("/cart");
};

const getCheckout = (_, res) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};

const getOrders = (_, res) => {
  res.render("shop/orders", { pageTitle: "Your Orders", path: "/orders" });
};

const getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
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
  const productModel = new Product();
  productModel.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

export default {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
};
