import express from "express";
import authController from "../../controllers/auth.js";
import User from "../../models/user.js";
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
        // if (value === "test@test.com") {
        //   throw new Error("This email address if forbidden.");
        // }
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email exists already.");
          }
        });
      }),
    body("password")
      .isLength({ min: 5 })
      .withMessage(
        "please enter a password with only numbers and text and at least 5 characters."
      )
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        // error 를 던지면 validationResult가 감지해서 error로 던짐
        throw new Error("Passwords have to match!");
      }

      return true;
    }),
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
