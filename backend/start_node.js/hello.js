const http=require("http");                             //http 객체 생성        /require() : 모듈을 읽어오는 함수
let count = 0;

const server = http.createServer((req, res) => {        //서버 객체 생성        createServer(콜백함수 - req : 요청 res : 응답) : 서버 인스턴스를 만드는 함수
    log(count);                                         //카운트 1 증가         count는 요청에 대한 로그, 전역 변수
    res.statusCode = 200;                               //결과값 200           http프로토콜에서 200 : 성공 
    res.setHeader("Content-Type", "text/plain");        //헤더 설정             헤더에 부가 정보 설정
    res.write("hello\n");                               //응답값 설정
    setTimeout(()=>{
        res.end("Node.js");                             //2초 후 Node.js 출력
    }, 2000);
})

function log(count){
    console.log((count+=1));
}

server.listen(8000, ()=>console.log("Hello Node.js"));  //8000번 포트로 서버 실행
