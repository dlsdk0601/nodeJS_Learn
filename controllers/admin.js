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
  const product = new Product({ title, price, description, imageUrl });

  // mongoose를 사용하기 이전에 product라는 class에 save라는 함수를 만들어서 사용했지만, 이제 mongoose 내부에 있는 save라는 함수로 db에 저장
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

const getProducts = (req, res) => {
  Product.find()
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
  Product.deleteById(prodId)
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
