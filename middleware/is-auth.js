// CSRF (cross-site request Forgery)
// CSRF는 사이트 간 요청 위조를 의미한다.
// 세션을 악용하여 사용자를 속이고, 악성코드를 삽입하여 특수한 공격 방법을 의미한다.

const isAuthHaldler = (req, res, next) => {
  if (!req.session.isLogged) {
    return res.redirect("/login");
  }

  next();
};

export default isAuthHaldler;
