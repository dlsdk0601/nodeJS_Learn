import express from "express";
import authController from "../../controllers/auth.js";

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/signup", authController.getSignUp);

authRouter.post("/signup", authController.postSignUp);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

export default authRouter;
