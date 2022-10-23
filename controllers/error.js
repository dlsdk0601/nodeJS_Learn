import path from "path";

const __dirname = path.resolve();

const get404 = (_, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found.",
    path: "/404",
    isAuthenticated: req.isAuthenticated,
  });
};

export default {
  get404,
};
