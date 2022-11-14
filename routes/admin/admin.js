import express from "express";
import adminController from "../../controllers/admin.js";
import isAuthHaldler from "../../middleware/is-auth.js";

const adminRoutes = express.Router();

// 라우터는 왼쪽부터 차례대로 실행시킨다.
adminRoutes.get("/add-product", isAuthHaldler, adminController.getAddProduct);

adminRoutes.get("/products", isAuthHaldler, adminController.getProducts);

adminRoutes.post("/add-product", isAuthHaldler, adminController.postAddProduct);

adminRoutes.get(
  "/edit-product/:productId",
  isAuthHaldler,
  adminController.getEditProduct
);

adminRoutes.post(
  "/edit-product",
  isAuthHaldler,
  adminController.postEditProduct
);

adminRoutes.post(
  "/delete-product",
  isAuthHaldler,
  adminController.postDeleteProduct
);

export default adminRoutes;
