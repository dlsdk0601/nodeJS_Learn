const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  // 장바구니를 해당 페이지에 올때마다 새로 생성하는게 아니라, 만들어진 애를 계속 보여주는거라서 constructor가 아닌 static을 사용

  constructor() {}

  static addProduct(id, productPrice) {
    // 기존의 장바구니를 조회
    // 새로운 상품이면 추가 및 수량 증가
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      let updateProduct;

      if (existingProduct) {
        updateProduct = { ...existingProduct, qyt: existingProduct.qty + 1 };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updateProduct;
      } else {
        updateProduct = {
          id,
          qty: 1,
        };
        cart.products = [...cart.products, updateProduct];
      }

      cart.totalPrice = cart.totalPrice + productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((item) => item.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (item) => item.id !== id
      );
      updatedCart.totalPrice -= price * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) cb(null);
      cb(cart);
    });
  }
};
