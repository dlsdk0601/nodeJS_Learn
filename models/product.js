const fs = require("fs");
const path = require("path");

const products = [];
module.exports = class Product {
  constructor(title) {
    if (title) {
      this.title = title;
    }
  }

  save() {
    products.push(this);
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  fetchAll(callBack) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callBack([]);
      }
      callBack(JSON.parse(fileContent));
    });
  }
};

// module.exports = { Product };
