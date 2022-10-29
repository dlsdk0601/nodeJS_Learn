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
      res.redirect("/");
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

export default { getLogin, postLogin, postLogout };
