//라우터와 실행하는 함수 부분을 나누어 준다

const http = require("http");
const url = require("url");
http
    .createServer((req, res) => {
        const path = url.parse(req.url, true).pathname;
        res.setHeader("Content-Type", "text/html");

        if(path==="/user"){
            user(req, res);                                         //user 함수 실행
        }else if(path==="/feed"){
            feed(req, res);                                         //feed 함수 실행
        }else{
            notFound(req, res);                                     //notFound 함수 실행
        }
    })
    .listen("3000", () => console.log("라우터를 만들어보자!"));


const user = (req, res) => {                                        //user 함수
    res.end(`[user] name: andy, age: 30`)
};

const feed = (req, res) => {                                        //feed 함수
    res.end(`<ul>
    <li>picture1</li>
    <li>picture2</li>
    <li>picture3</li>
    </ul>
    `)
}

const notFound = (req, res) => {                                    //notFound 함수
    res.statusCode = 404;
    res.end("404 page not found");
};


//이 경우 분기문에서 모든 요청을 분석하므로 경우가 너무 많아질 경우 유지 보수 어려워짐