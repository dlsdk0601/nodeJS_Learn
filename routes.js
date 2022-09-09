const fs = reuire("fs");

const requestHanlder = (req, res) => {
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
};

module.exports = requestHanlder;
