const path = require("path");
const Product = require("../models/product");

const getAddProduct = (_, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
};

const postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

const getProducts = (_, res) => {
  // ::::::::::::::::::::::::::::::::::::::::::::
  // 절대 경로로 작성해야한다.
  // __dirname 현재 서버가 돌아가는 절대 경로 (이 파일에서 불러오면 routes까지 경로를 의미 )
  // 절대 경로에서 ../views/shop.html을 붙여주는 역할을 join이 한다
  // res.sendFile(path.join(__dirname, "../", "views", "shop.html"));

  // ::::::::::::::::::::::::::::::::::::::::::::
  // pug 탬플릿을 사용할 경우는 render로 파일을 부르고 app.js에서 이미 pug를 사용한다고 정의했기에 .pug는 생략 가능. 그리고 views 경로도 설정 헤줬기 때문에 경로도 path도 필요없음.
  const prod = new Product();
  const products = prod.fetchAll();
  res.render("shop", { prods: products, docTitle: "Shop" });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
