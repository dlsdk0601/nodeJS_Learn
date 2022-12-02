import fs from "fs";
import path from "path";
import Product from "../models/product.js";
import Order from "../models/order.js";

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        csrfToken: req.csrfToken(), // csrfToken 매서드는 미들웨어에 의해 추가된다. app.js 참고
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getCart = (req, res, next) => {
  return req.user
    .populate("cart.items.productId") // cart 객체를 반환한다.
    .then((user) => {
      const products = [...user.cart.items];

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products ?? [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders,
        pageTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // mongoose에 findById라는 함수가 내장돼잇음
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        prd: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, productData: { ...item.productId } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user, // user 전체를 넘기면 mongoose가 Id를 받아온다.
        },
        products,
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then(order => {
    if(!order){
      return next(new Error("No order found."));
    }

    if(order.user.userId.toString() !== req.user._id.toString()){
      return next(new Error("Unauthorized"));
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join("data", "invoices", invoiceName);
    fs.readFile(invoicePath, (err, data) => {
      if(err){
        return next(err);
      }

      res.setHeader("Content-Type", "application/pdf"); // 반환하는 형식을 json이 아니라 pdf 로 반환
      res.setHeader("Content-Disposition", `inline; filename='${invoiceName}'`); // a 링크 클릭시, 새탭에서 파일 열기
      res.send(data);
    });
  }).catch(err => next(err))

}

export default {
  getProducts,
  getIndex,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getInvoice
};
