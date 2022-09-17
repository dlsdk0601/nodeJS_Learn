const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// /products/delete 같은 라우팅을 피하기 위해 순서가 중요함. 위에서 아래로 거쳐가야하고, 위에서부터 아래로 파싱된다. 이러면 저 아래에 /products/delete 가 있다하더라도 도달하지 못함.
router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
