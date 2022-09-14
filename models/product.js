const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      // this가 class의 this임을 명확하게 하기 위해 arrow Function 사용
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
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
};

// module.exports = { Product };
