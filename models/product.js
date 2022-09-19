const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callBack) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callBack([]);
    } else {
      callBack(JSON.parse(fileContent));
    }
  });
};
module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const index = products.findIndex((item) => item.id === this.id);
        const updateProducts = [...products];
        updateProducts[index] = this;
        fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        // this가 class의 this임을 명확하게 하기 위해 arrow Function 사용
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  fetchAll(callBack) {
    getProductsFromFile(callBack);
  }

  findById(id, callBack) {
    getProductsFromFile((products) => {
      const product = products.find((prd) => prd.id === id);
      callBack(product);
    });
  }

  deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((item) => item.id === id);
      const updateProduct = products.filter((prd) => prd.id !== id);
      fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};

// module.exports = { Product };
