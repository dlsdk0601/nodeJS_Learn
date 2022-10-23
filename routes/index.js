import express from "express";
import shopRoutes from "./shop/shop.js";
import adminRoutes from "./admin/admin.js";
import authRouter from "./auth/auth.js";

const api = express.Router();

api.use("/admin", adminRoutes);
api.use(shopRoutes);
api.use(authRouter);

export default api;
