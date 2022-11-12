import User from "../models/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import dotenv from "dotenv";
import crypto from "crypto"; // node 에 내장되 있는 라이브러리

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

    console.log("buffer==");
    console.log(buffer);
    const token = buffer.toString("hex"); // buffer가 16진법 값을 저장하므로 hex를 파라미터로 넣어서, 일반 아스키 문자로 변환하라고 명명 해줘야한다.
    console.log("token===");
    console.log(token);
  });
};

export default {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  poetReset,
};
