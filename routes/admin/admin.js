import express from "express";
import adminController from "../../controllers/admin.js";
import isAuthHaldler from "../../middleware/is-auth.js";
import { body } from "express-validator";

const adminRoutes = express.Router();

// 라우터는 왼쪽부터 차례대로 실행시킨다.
adminRoutes.get("/add-product", isAuthHaldler, adminController.getAddProduct);

adminRoutes.get("/products", isAuthHaldler, adminController.getProducts);

adminRoutes.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuthHaldler,
  adminController.postAddProduct,
);

adminRoutes.get("/edit-product/:productId", isAuthHaldler, adminController.getEditProduct);

adminRoutes.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuthHaldler,
  adminController.postEditProduct,
);

adminRoutes.post("/delete-product", isAuthHaldler, adminController.postDeleteProduct);

// 제품 삭제를 비동기 통신으로 시도해보기 위한 API
adminRoutes.delete("/product/:productId", isAuthHaldler, adminController.deleteProduct);

export default adminRoutes;
