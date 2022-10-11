import mongodb from "mongodb";
import Product from "../models/product.js";

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
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      console.log("product===");
      console.log(product);
      res.render("admin/edit-product", {
        pageTitle: "edit-product",
        path: "/admin/products",
        editing: true,
        product,
      });
    })
    .catch((err) => console.log(err));
};

const postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl);

  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

const getProducts = (req, res) => {
  Product.fetchAll()
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

  const product = new Product(title, price, description, imageUrl, productId);
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
