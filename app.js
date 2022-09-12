const express = require("express");

const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const path = require("path");

const app = express();

// view engine으로 어떤걸 사용할 건지 설정.
// 설정하지 않을 경우, 기본 html이 디폴트
// pug, ejs 등과 같은 엔진이 있다.
app.set("view engine", "pug");
app.set("views", "views");

const admonRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

// html에 해당하는 css 파일이 다운 받아지지 않음
// public폴더는 공개 폴더이므로 여기에 css같은 파일을 넣어놓음. 그외 라우팅은 express에서 라우팅 처리하려고 시도함
// express.static 정적으로 서비스하기 원하는 폴더 경로를 입력하면 된다. (바로 읽기 권한은 허용하고자하는 폴더)
// 이제 .css나 .js파일을 찾으려할때는 자동으로 public 폴더로 포워딩한다.
app.use(express.static(path.join(__dirname, "public")));

// router 순서가 매우 중요하기에, 잘 고려해서 순서대로 작성할것.
app.use("/admin", admonRoutes);
app.use(shopRoutes);

// 404 error
app.use(errorController.get404);

app.listen(3000);
