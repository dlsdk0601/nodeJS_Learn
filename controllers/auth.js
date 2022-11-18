import User from "../models/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import dotenv from "dotenv";
import crypto from "crypto"; // node 에 내장되 있는 라이브러리
import { validationResult } from "express-validator";

dotenv.config();

// email을 어떻게 전달할지 nodemailer에 알려주느 설정
// sendgridTransport 는 sendGrid 라는 이메일 보내는 회사임.
// 이 회사의 메일 시스템을 이용하기 위해 nodemailer-sendgrid-transport를 install 한거임
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.NODEMAILER_API_KEY,
    },
  })
);

const getLogin = (req, res) => {
  // error에 저장돼있던 내용을 불러온다. 이 후에 정보는 세션에서 제거된다.
  // req.flash("error")는 한번이라도 호출되면 바로 삭제됨.

  const error = req.flash("error");
  const errorMessage = error.length > 0 ? error[0] : null;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    errorMessage,
  });
};

const postLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // flash 알림을 저장하는데 이때 key는 error로 하는데 사실 아무 이름 써도됨
        req.flash("error", "Invlaid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLogged = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invlaid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

const postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    // 세션이 파괴됐으므로 req.session은 사용못함
    res.redirect("/");
  });
};

const getSignUp = (req, res) => {
  const error = req.flash("error");
  const errorMessage = error.length > 0 ? error[0] : null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    errorMessage,
  });
};

const postSignUp = (req, res) => {
  const {
    body: { email, password, confirmPassword },
  } = req;

  // router 미들웨어로 email 필드를 검사 하라고 했고, 검사 후 결과를
  // req안에 담아주고 우리는 그걸 validationResult를 통해서 판정한다.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "signup",
      errorMessage: errors.array(),
    });
  }

  if (confirmPassword !== password) {
    return res.redirect("/signup");
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email exists already.");
        return res.redirect("/signup");
      }
      // bcrypt의 hash에 대해서는 더 자세한 설명이 있는 다른 프로젝트 참고
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "inajung7008@gmail.com",
            subject: "welcome",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// 비밀번호 변경 로직 순서
// /reset페이지로 이동 => 아이디 조회 => 아이디는 이메일이라서 아이디로 token이 담긴 link 달아서 전송 => link 클릭 후, 새 비밀번호 입력 => 입력 후 resetToken 없애고, 비밀번호 갱신하고 로그인 페이지로 이동

const getReset = (req, res) => {
  const error = req.flash("error");
  const errorMessage = error.length > 0 ? error[0] : null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage,
  });
};

const poetReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    // buffer가 16진법 값을 저장하므로 hex를 파라미터로 넣어서, 일반 아스키 문자로 변환하라고 명명 해줘야한다.
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1시간 뒤에 만료
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "inajung7008@gmail.com",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
};

const getNewPassword = (req, res) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }, //오늘보다 큰 날짜를 선택하는건데 $gt의 뜻이 value보다 크다라는 뜻, 즉 오늘보다 토큰 만료일이 미래일 경우만 골라냄
  })
    .then((user) => {
      const error = req.flash("error");
      const errorMessage = error.length > 0 ? error[0] : null;

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

const postNewPassword = (req, res) => {
  const {
    body: { userId, password, passwordToken },
  } = req;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

export default {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  poetReset,
  getNewPassword,
  postNewPassword,
};
