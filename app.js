import express from "express";
import bodyParser from "body-parser";
import path from "path";
import errorPage from "./controllers/error.js";
import api from "./routes/index.js";
import mongoose from "mongoose";
// import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const __dirname = path.resolve();

// view engine으로 어떤걸 사용할 건지 설정.
// 설정하지 않을 경우, 기본 html이 디폴트
// pug, ejs 등과 같은 엔진이 있다.
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// html에 해당하는 css 파일이 다운 받아지지 않음
// public폴더는 공개 폴더이므로 여기에 css같은 파일을 넣어놓음. 그외 라우팅은 express에서 라우팅 처리하려고 시도함
// express.static 정적으로 서비스하기 원하는 폴더 경로를 입력하면 된다. (바로 읽기 권한은 허용하고자하는 폴더)
// 이제 .css나 .js파일을 찾으려할때는 자동으로 public 폴더로 포워딩한다.
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById("62ffa791a32d81e23d2ecf80")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// router 순서가 매우 중요하기에, 잘 고려해서 순서대로 작성할것.
app.use(api);

// 404 error
app.use(errorPage.get404);

// sequelize와 관련된 명령어 모두 지움

// 이제부터 mongoose 시작

// db.mongoConnect((client) => {
//   app.listen(3000, () => console.log("connect!!::::::::::::::::"));
// });
mongoose
  .connect(
    `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWOR}@portfolio.dacwcma.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => console.log("connect:::::::::::::::::::::::"));
  })
  .catch((err) => console.log(err));
