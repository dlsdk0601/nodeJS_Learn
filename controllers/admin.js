const path = require("path");
const Product = require("../models/product");

const getAddProduct = (_, res) => {
  // html::::::::::::::::::::::::::::::::::::::::::
  // res.sendFile(
  //   path.join(__dirname, "../", "views", "admin", "add-product.pug")
  // );

  // pug::::::::::::::::::::::::::::::::::::::::::
  res.render("admin/edit-product", {
    pageTitle: "add-product",
    path: "/admin/add-product",
    editing: false,
  });
};

const getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  const productModel = new Product();
  productModel.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "edit-product",
      path: "/admin/products",
      editing: true,
      product,
    });
  });
};

const postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({
    title,
    imageUrl,
    price,
    description,
  })
    .then((res) => {})
    .catch((err) => console.log(err));
};

const getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

const postEditProduct = (req, res) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const productModel = new Product(
    productId,
    title,
    imageUrl,
    price,
    description
  );

  productModel.save();
  res.redirect("/admin/products");
};

const postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  const productModel = new Product();
  productModel.deleteById(prodId);
  res.redirect("/admin/products");
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
