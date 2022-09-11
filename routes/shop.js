const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
  // 절대 경로로 작성해야한다.
  // __dirname 현재 서버가 돌아가는 절대 경로 (이 파일에서 불러오면 routes까지 경로를 의미 )
  // 절대 경로에서 ../views/shop.html을 붙여주는 역할을 join이 한다
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;
