import User from "../models/user.js";
import bcrypt from "bcryptjs";

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
        });
    })
    .catch((err) => console.log(err));
};

export default { getLogin, postLogin, postLogout, getSignUp, postSignUp };
