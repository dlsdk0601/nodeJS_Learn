const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// app middleware에 bodyparser를 추가해서, req 가 body를 parse 시킨다.
// bodyparser함수 끝에는 next()가 포함되어있어, 다음 middleware로 이동한다.
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
  res.send(
    "<html><form action='/product' method='POST' ><input type='text' name='title'/><button type='submit'>submit</button></form></html>"
  );
  //   여기서 next를 쓰게 되면 다음 middleware로 넘어가기에 사용해선 안됨
});

app.use("/product", (req, res, next) => {
  // 해당 console은 undefined로 찍힌다.
  //   req에 body 속성이 있지만, req는 스스로 body를 parse하지 않습니다.
  // 때문에 body-parser라는 라이브러리를 사용합니다.
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello world</h1>");
});

app.listen(3000);
