// 서버 생성
const http = require("http");

// http가 만든 서버를 변수에 저장해야합니다.

const server = http.createServer((req, res) => {
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
