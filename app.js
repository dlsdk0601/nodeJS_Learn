const http = require("http");
const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("middle1");
});

app.use((req, res, next) => {
  // 첫번째 미들웨어에서 next()를 하지 않으면 넘어오지 않음
  console.log("middle2");
});

const server = http.createServer(app);

server.listen(3000);
