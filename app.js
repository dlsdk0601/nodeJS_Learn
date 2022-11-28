import express from "express";
import bodyParser from "body-parser";
import path from "path";
import errorPage from "./controllers/error.js";
import api from "./routes/index.js";
import mongoose from "mongoose";
import User from "./models/user.js";
import dotenv from "dotenv";
import session from "express-session";
import mongoDBStore from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import multer from "multer";

dotenv.config();

const MONGODB_URI = `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWOR}@portfolio.dacwcma.mongodb.net/shop?w=majority`;

const app = express();

const MongoDBStore = mongoDBStore(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions", // 반드시 정의 해줘야하며, 이름은 아무렇게나 해도 무관
});

const csrfProftection = csrf({});

const __dirname = path.resolve();

// view engine으로 어떤걸 사용할 건지 설정. 설정하지 않을 경우, 기본 html이 디폴트
// pug, ejs 등과 같은 엔진이 있다.
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));

// dest: "images"는 buffer로 전달해주는게 아니라  /images라는 폴더에 바로 생성시킨다.
app.use(multer({dest: "images"}).single("image"));

// html에 해당하는 css 파일이 다운 받아지지 않음
// public폴더는 공개 폴더이므로 여기에 css같은 파일을 넣어놓음. 그외 라우팅은 express에서 라우팅 처리하려고 시도함
// express.static 정적으로 서비스하기 원하는 폴더 경로를 입력하면 된다. (바로 읽기 권한은 허용하고자하는 폴더)
// 이제 .css나 .js파일을 찾으려할때는 자동으로 public 폴더로 포워딩한다.
app.use(express.static(path.join(__dirname, "public")));

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// seesion 함수에 객체를 넣는데, 세션 설정에 들어갈 값들로 구성한 객체이다.

// secret같은 경우 ID를 비밀리에 쿠키에 저장하는 해시를 등록 할때 사용된다.
// 토큰 같은 값을 넣어야하나, 여기서는 짧게 쓴다.

// resave는 세션이 완료되는 모든 요청마다(그냥 모든 요청) 저장시키는게 아니라
// 세션이 변경되었을때만 저장 시키는 옵션 (false을 넣어야 그렇게됨)

// saveUninitialized은 저장할 필요가 없는 요청의 경우 변경된 내용이 없어서 아무 세션에서 저장되지 않도록한다.
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// 로그아웃 할 때, postLogout 요청에도 토큰을 확인하나, 로그아웃이기에 토큰이 없다.
// 그래서 view 단에 토큰을 input에 저장 시켜놓고 로그아웃할때 같이 보내야한다.
app.use(csrfProftection);

// 로그인 실패를 예로 들어보면 에러 처리를 해야하는데, redirect의 경우 데이터 넘기는게 힘들어서
// session을 활용하려한다. 이때 필요한 lib이 connect-flash 이다
// 이는 세션을 초기화한 다음 해야하므로 session 미들웨어 이후에 작성한다.
app.use(flash());

app.use((req, res, next) => {
  // csrf 토큰을 render할때 추가 해줘야하기에 모든 view단 route controller에 추가하면 복잡하니까,
  // middleware로 한번에 처리해준다.

  // view에만 존재하므로 local이라고 부른다.
  res.locals.isAuthenticated = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
});

// router 순서가 매우 중요하기에, 잘 고려해서 순서대로 작성할것.
app.use(api);

// 500 error 페이지
app.use("/500", errorPage.get500);

// 404 error
app.use(errorPage.get404);

// catch 안에 던져진 에러 처리
app.use((err, req, res, next) => {
  // res.status.(err.thhpStatusCode).render(...) 이런식으로 redirect가 아닌 render로도 처리 가능
  console.log(err)
  return res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn
  });
});

// 이제부터 mongoose 시작
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8000, () => console.log("connect:::::::::::::::::::::::"));
  })
  .catch((err) => console.log(err));
