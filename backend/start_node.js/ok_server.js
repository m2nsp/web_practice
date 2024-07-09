const http = require("http");
const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");                    //응답의 헤더 설정: 'text/html': 텍스트를 html로 해석하겠다
    res.end("OK");                                                 //"OK"를 응답하고 종료
});

server.listen("3000", () => console.log("OK 서버 시작!"));          //접속대기  /3000: 포트 번호, 그 뒤 함수: 콜백 함수