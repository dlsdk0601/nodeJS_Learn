import path from "path";

const __dirname = path.resolve();

const get404 = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found.",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const get500 = (_, res) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export default {
  get404,
  get500,
};
