import express from "express";
import authController from "../../controllers/auth.js";
import { check, body } from "express-validator";
// 많은 패키지 중에서 유효성 검사하는 부분만 필요해서 check만 가져온다.
// check는 body, 매게변수, 쿼리 매게변수 등을 확인
// body, param, query, cookie, header 등을 추가하여 들어오는 요청중에서 특정 기능들만을 확인 간으

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.get("/signup", authController.getSignUp);

// error 메세지를 커스텀 할 수 도 있다.
authRouter.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("please enter a valid email.")
      .custom((value, { req }) => {
        if (value === "test@test.com") {
          throw new Error("This email address if forbidden.");
        }

        return true;
      }),
    body("password")
      .isLength({ min: 5 })
      .withMessage(
        "please enter a password with only numbers and text and at least 5 characters."
      )
      .isAlphanumeric(),
  ],
  authController.postSignUp
);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

authRouter.get("/reset", authController.getReset);

authRouter.post("/reset", authController.poetReset);

authRouter.get("/reset/:token", authController.getNewPassword);

authRouter.post("/new-password", authController.postNewPassword);

export default authRouter;
