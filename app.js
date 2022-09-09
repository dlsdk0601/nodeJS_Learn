// 서버 생성
const http = require("http");
const routes = require("./routes");

// http가 만든 서버를 변수에 저장해야합니다.

const server = http.createServer(routes);

// node가 script를 바로 종료하지 않고, 계속 실행되게합니다.
server.listen(3000);
