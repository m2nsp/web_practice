const http = require("http");
const url = require("url")                          //url 모듈을 로딩
http
    .createServer((req, res) => {
        const path = url.parse(req.url, true).pathname;    //'true'는 쿼리 스트링도 함께 파싱할 지 여부를 설정하는 변수
        res.setHeader("Content-Type", "text/html");        //한글을 사용하고 싶을 경우 : res.setHeader("Content-Type", "text/html; charset=utf-8");

        if(path==="/user"){
            res.end("[user] name: andy, age: 30");
        }else if(path==="/feed"){                   //백틱(` `)을 사용하면 여러줄 문자열을 사용할 수 있고 손쉽게 표현식을 ${}을 통해서 삽입할 수 있다 => '\n'나 문자열 연결('+') 불필요
            res.end(`<ul>                               
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
            </ul>
        `);                                         // '/feed'에 대한 결괏값 설정
        }else{
            res.statusCode = 404;                   //HTTP 프로토콜 수준에서 상태 명확히 하는 것
            res.end("404 page not found");          //결괏값으로 에러 메시지 설정(= 사용자에게 상태 전달)
        }
    })
    .listen("3000", () => console.log("라우터를 만들어보자!"));


    //현재는 요청에 대한 응답을 createServer()안에서 직접 컨트롤 => 콜백 함수에 보든 코드를 다 추가해야 됨