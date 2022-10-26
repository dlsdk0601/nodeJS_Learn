const getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenticated: false,
  });
};

const postLogin = (req, res) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};

export default { getLogin, postLogin };
