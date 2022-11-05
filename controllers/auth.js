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
  const {
    body: { email, password },
  } = req;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
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

  if (confirmPassword !== password) {
    return res.redirect("/signup");
  }

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
