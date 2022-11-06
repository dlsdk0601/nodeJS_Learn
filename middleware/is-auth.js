const isAuthHaldler = (req, res, next) => {
  if (!req.session.isLogged) {
    return res.redirect("/");
  }

  next();
};

export default isAuthHaldler;
