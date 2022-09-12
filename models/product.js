const products = [];
module.exports = class Product {
  constructor(title) {
    if (title) {
      this.title = title;
    }
  }

  save() {
    products.push(this);
  }

  fetchAll() {
    return products;
  }
};

// module.exports = { Product };
