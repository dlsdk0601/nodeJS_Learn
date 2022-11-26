# NodeJS 배우기

지금까지 어깨넘어와 구글을 통해서 배운 node로 개인 프로젝트를 진행했었는데, 이번 기회에 제대로 배워보려 합니다.
항상 제대로 배워보고 싶어서, 기회만 봤었는데 이번에 기회가 되서 차근차근 배워보려합니다.

프로그래밍적인 부분을 학습하기전에 먼저 기본 이론은 여기 README.md에 정리 해보려합니다.

<br />

## 실행 방법

git clone을 받으 신 후,

> npm i

로 node_modules을 다운 받으시고,

> npm start

로컬 서버를 키신 후, localhost:3000 접속

## Web 동작 방식

user / client 단이 있습니다.
흔히 유저가 브라우저로 접속했을 경우 입니다.

유저는 url입력란에 도메인을 치고 접속합니다.
이 도메인은 실제 주소가 아닙니다. 일반인들이 쉽게 인지 할 수 있게하기 위함이고 최종적으로 이 URL을 입력하게 되면 어딘가의 서버로 연결됩니다.

이렇게 연결하게 되면 해당 서버로 요청을 보내게 되며 그 IP 주소는 도메인에 속합니다.
그리고 연결 후, 서버에서는 클라이언트로 응답을 다시 보내게 됩니다.

이 응답은 HTML 파일일 수도 있고, JSON 또는 XML을 비롯한 다른 종류의 데이터일 수도 있습니다. 이런 데이터를 받고나서의 처리는 클라이언트단이 해결해야하는 일입니다.

nodeJS는 이렇게 요청을 받았을때, 응답을 보내는 역할을 하는 서버 사이드에서 코드를 말합니다.

### Core Modules

node는 각 파일마다 명확한 역할이 있어야합니다.
그리고 제 3자 모듈을 사용하기 위해서는 라이브러리를 다운 받아야하지만, 기본적인 core modules만 사용 할 수 있습니다.

이 기본 core Modules는

- http
  => 서버를 생성하고, 요청을 보내는 것과 같은 작업을 도와준다.
- https
  => 모든 전송 데이터가 암호화되는 SSL 암호화 서버 생성을 도와준다
- fs
- path
- os

입니다.

### node 라이플 사이클

node app.js (app.js 실행) => script 시작 => 코드 분석 후, 변수와 함수를 등록 => 실행을 멈추지 않고 계속 돌려놓음

위의 라이프 사이클을 지키기 위해서, node의 이벤트 루프 라는 개념 때문입니다.

node가 관리하는 이벤트 루프는 작업이 남아 있는 한 계속해서 작동하는 루프 프로세스로 EventListener가 있는한 계속 작동합니다.

node가 이런 라이플 사이클을 가지는 이유는, 단일 스레드 js를 실행하기 때문입니다.


### http status code

2xx : 성공 코드
- 200: Operation succeeded
- 201: Success, resource created

3xx : 리다이렉션이 발생
- 301: moved permanently

4xx : client side error
- 401: Not authenticated
- 403: Not authorized
- 404: Not found
- 422: Invalid input

5xx : server side error
- 500: server error