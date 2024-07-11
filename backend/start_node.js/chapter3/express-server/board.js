const express = require("express");
const app = express();
let posts = [];                                 //게시글 리스트로 사용할 posts에 빈 리스트 할당

//req.body를 사용하려면 JSON 미들웨어를 사용해야 함
//사용하지 않으면 undefined로 반환
app.use(express.json());                        //JSON 미들웨어 활성화

//POST 요청 시 컨텐트 타입이 application/x-www-form-urlencoded인 경우 파싱
app.use(express.urlencoded({extended: true}));  //JSON 미들웨어와 함께 사용

//게시글 조회
app.get("/", (req, res) => {                    // /로 요청이 오면 실행
    res.json(posts);                            // 게시글 리스트를 JSON 형식으로 보여줌
});

//게시글 추가
app.post("/posts", (req, res) => {              // /posts로 요청이 오면 실행
    const{title, name, text} = req.body;        // HTTP 요청의 body 데이터를 변수에 할당

    //게시글 리스트에 새로운 게시글 정보 추가
    posts.push({id: posts.length+1,
                title,
                name,
                text,
                createdDt: Date(),
                likes: 0,                      // 좋아요 수 초기화
                comments: []                   // 댓글 리스트 초기화
       });
    res.json({title, name, text});
});

//게시글 수정
app.put("/posts/:id", (req, res) => {
    // /posts/:id로 PUT 요청이 오면 실행
    const id = +req.params.id; // app.put에 설정한 path 정보에서 id값을 가져옴; +는 형변환을 위해서 붙어있는 것임
    const { title, name, text } = req.body; // HTTP 요청의 body 데이터를 변수에 할당
  
    // 게시글 리스트에서 해당 ID의 게시글을 찾아 수정
    const postIndex = posts.findIndex((post) => post.id === id);          //post가 posts 배열을 순회하면서 id값이 주어진 id값과 같은 것을 찾음
    if (postIndex !== -1) {
      posts[postIndex] = { 
        ...posts[postIndex],
        title,
        name,
        text,
        updatedDt: Date()
      };
      res.json(posts[postIndex]);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

//게시글 삭제
app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;                   // app.delete에 설정한 path 정보에서 id값을 가져옴
    const filteredPosts = posts.filter((post) => post.id !== +id);      //글 삭제 로직
    const isLengthChanged = posts.length !== filteredPosts.length;      //삭제 확인
    posts = filteredPosts;
    if(isLengthChanged){                        //posts의 데이터 개수가 변경되었으면 삭제 성공
        res.json("OK");
        return;                                 //true인 경우 return 키워드로 인해 함수가 종료되므로 아래로 더 내려가지 않음
    }
    res.json("NOT CHANGED");
});


// /posts/:id/like로 PUT 요청이 오면 실행 - 좋아요 기능
app.put("/posts/:id/like", (req, res) => {
  const id = +req.params.id;
  const post = posts.find((post) => post.id === id);
  if (post) {
    const {action} = req.body;
    if(action === "like"){
      post.likes += 1; // 좋아요 수 증가
      res.json(post);
    }else if(action === "unlike"){
      if(post.likes > 0){
        post.likes -= 1;  //좋아요 수 감소
        res.json(post);
      }else{
        res.status(400).json({error: "No likes to remove"});
      }
    }else{
      res.status(400).json({error: "Invalid action"});
    }
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});


// /posts/:id/comments로 POST 요청이 오면 실행 - 댓글 추가
app.post("/posts/:id/comments", (req, res) => {
  const id = +req.params.id;
  const post = posts.find((post) => post.id === id);
  if (post) {
    const { name, text } = req.body;
    const comment = { id: post.comments.length + 1, name, text, createdDt: Date() };
    post.comments.push(comment); // 댓글 리스트에 추가
    res.json(comment);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// /posts/:id/comments로 GET 요청이 오면 실행 - 댓글 조회
app.get("/posts/:id/comments", (req, res) => {
  const id = +req.params.id;
  const post = posts.find((post) => post.id === id);
  if (post) {
    res.json(post.comments);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// /posts/:postId/comments/:commentId로 DELETE 요청이 오면 실행 - 댓글 삭제
app.delete("/posts/:postId/comments/:commentId", (req, res) => {
  const postId = +req.params.postId;
  const commentId = +req.params.commentId;
  const post = posts.find((post) => post.id === postId);
  if (post) {
    const originalLength = post.comments.length;
    post.comments = post.comments.filter((comment) => comment.id !== commentId);
    if (post.comments.length < originalLength) {
      res.json("Comment deleted");
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});


app.listen(3000, () => {
    console.log("간단 게시판 만들기");
});


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  