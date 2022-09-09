// 서버 생성
const http = require("http");
const fs = require("fs");

// http가 만든 서버를 변수에 저장해야합니다.

const server = http.createServer((req, res) => {
  // router 요청 처리 ::::::::::::::::::::::::::::::::
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head>");
    res.write("<title>My First Page</title>");
    res.write("</head>");
    res.write("<body>");
    res.write(
      "<form action='/message' method='POST'><input type='text'/><button type='submit'>click</button></form>"
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on(
      "data",
      (chunk) => {
        console.log(chunk);
        body.push(chunk);
      },
      (err) => console.log(err)
    );
    return req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1];

      // writeFile method도 존재함
      // sync는 동기화를 의미 => 비동기와 반대로 파일이 생성될때까지 머무르고 다음을 실행시킴
      fs.writeFileSync("message.txt", message);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head>");
  res.write("<title>My First Page</title>");
  res.write("</head>");
  res.write("<body>");
  res.write("<h1>Hello from Server!</h1>");
  res.write("</body>");
  res.write("</html>");
  res.end();
});

// node가 script를 바로 종료하지 않고, 계속 실행되게합니다.
server.listen(3000);
