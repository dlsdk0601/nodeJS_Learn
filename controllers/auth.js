import User from "../models/user.js";

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

export default { getLogin, postLogin, postLogout, getSignUp };
