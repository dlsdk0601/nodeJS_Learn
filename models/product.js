const products = [];

class Product {
  constructor(title) {
    this.title = title;
  }

  save = () => {
    products.push(this);
  };

  static fecthAll = () => products;
}

module.exports = { Product };
