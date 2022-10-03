import express from "express";
import shopRoutes from "./shop/shop.js";
import adminRoutes from "./admin/admin.js";

const api = express.Router();

// api.use("/admin", adminRoutes);
api.use(shopRoutes);

export default api;
