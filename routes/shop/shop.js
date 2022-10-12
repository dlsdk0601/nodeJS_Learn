import express from "express";
import shopController from "../../controllers/shop.js";

const shopRoutes = express.Router();

shopRoutes.get("/", shopController.getIndex);

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// /products/delete 같은 라우팅을 피하기 위해 순서가 중요함. 위에서 아래로 거쳐가야하고, 위에서부터 아래로 파싱된다. 이러면 저 아래에 /products/delete 가 있다하더라도 도달하지 못함.
shopRoutes.get("/products", shopController.getProducts);

shopRoutes.get("/products/:productId", shopController.getProduct);

// shopRoutes.get("/cart", shopController.getCart);

// shopRoutes.post("/create-order", shopController.postOrder);

// shopRoutes.post("/cart-delete-item", shopController.postCartDeleteProduct);

shopRoutes.post("/cart", shopController.postCart);

// shopRoutes.get("/orders", shopController.getOrders);

export default shopRoutes;
