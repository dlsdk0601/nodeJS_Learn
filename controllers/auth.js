import User from "../models/user.js";
import bcrypt from "bcryptjs";

const getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenticated: req.session.isLogged,
  });
};

const postLogin = (req, res) => {
  User.findById("634c2663f1c2db98d820c0bb")
    .then((user) => {
      req.session.isLogged = true;
      req.session.user = user;
      req.session.save((err) => {
        // save를 굳이 해주지 않아도 알아서, save 되지만
        // 가끔 session이 DB에 저장하는 시간과 redirect 하는 도중 시간적 오차 때문에
        // save보다 redirect가 먼저 일어나고 로그인 처리가 되지 않은 / 화면을 볼수도있음
        // 물론 새로고침하면 다시 정상적으로 보일테지만, 한번에 처리하기 위해 save 호출하고 그안에
        // callback 함수로 받는다.
        console.log(err);
        res.redirect("/");
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
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    isAuthenticated: req.session.isLogged,
  });
};

const postSignUp = (req, res) => {
  const {
    body: { email, password, confirmPassword },
  } = req;

  User.findOne({ email })
    .then((user) => {
      if (user) {
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
        });
    })
    .catch((err) => console.log(err));
};

export default { getLogin, postLogin, postLogout, getSignUp, postSignUp };
