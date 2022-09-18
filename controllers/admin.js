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
    if (product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "edit-product",
      path: "/admin/edit-product",
      editing: true,
      product,
    });
  });
};

const postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

const getProducts = (req, res) => {
  const product = new Product();
  product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
};
