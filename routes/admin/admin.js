import express from "express";
import adminController from "../../controllers/admin.js";

const adminRoutes = express.Router();

adminRoutes.get("/add-product", adminController.getAddProduct);

adminRoutes.get("/products", adminController.getProducts);

adminRoutes.post("/add-product", adminController.postAddProduct);

adminRoutes.get("/edit-product/:productId", adminController.getEditProduct);

adminRoutes.post("/edit-product", adminController.postEditProduct);

adminRoutes.post("/delete-product", adminController.postDeleteProduct);

export default adminRoutes;
