const express = require("express");

const app = express();

app.use("/add-product", (req, res, next) => {
  res.send("<h1>add product page</h1>");
  //   여기서 next를 쓰게 되면 다음 middleware로 넘어가기에 사용해선 안됨
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello world</h1>");
});

app.listen(3000);
