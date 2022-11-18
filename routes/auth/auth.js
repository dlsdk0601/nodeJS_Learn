import express from "express";
import authController from "../../controllers/auth.js";
import { check } from "express-validator"; // 많은 패키지 중에서 유효성 검사하는 부분만 필요해서 check만 가져온다.

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/signup", authController.getSignUp);

authRouter.post("/signup", check("email").isEmail(), authController.postSignUp);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

authRouter.get("/reset", authController.getReset);

authRouter.post("/reset", authController.poetReset);

authRouter.get("/reset/:token", authController.getNewPassword);

authRouter.post("/new-password", authController.postNewPassword);

export default authRouter;
