const getLogin = (req, res) => {
  console.log(req.get("Cookie"));
  const isLoggedIn = req.get("Cookie").trim().split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "login",
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = (req, res) => {
  // 요청 req에 isLoggedIn 추가해서 true로 대입하고, 이걸로 로그인 상태 확인

  // 이게 과연 다른 API 요청에도 저장이 될까?
  // redirect는 완전 새로운 API를 요청하는거임.
  // req.user는 app.js 에서 미들웨어로 저장했기에 존재하는거임
  // 때문에 프론트로 전달될때 isAuthenticated는 찾지 못해서 undefined로 나타나게 된다.
  // 그리고 여러 사용자가 동시에 진행하게 되면, 같은 IP라도 다른 요청이기에 각각 따로 처리하게 된다.
  // 때문에 같은 값을 바라보면 안되기에, 의도적으로 설계가 이런식으로 된거임

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // 이때 글로벌 변수를 사용하면 되는데, 이를 프론트에도 사용하기 위해 쿠키를 사용하는게 좋다.

  // key-value 처럼 설정
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

export default { getLogin, postLogin };
