import express from 'express';

// import tasks from './file'         가상의 파일 불러온다고 가정

const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello Express!');
});

app.get('/tasks', (req, res) => {
    /*쿼리 파라미터
    * -sort : 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
    * -count: 태스크 개수
    * */
    const sort = req.query.sort;
    const count = Number(req.query.count);

    const compareFn =
       sort === 'oldest'
           ? (a, b) => a.createdAt - b.createdAt           //오름차순
           : (a, b) => b.createdAt - a.createdAt;          //내림차순
    
    let newTasks = tasks.sort(compareFn);
    
    if(count){
        newTasks = newTasks.slice(0, count);
    }
    
    res.send(newTasks);
})

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if(task){
        res.send(task);
    }else{
        res.status(404).send({message : 'Cannot find given id.'});
    }
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    const ids = tasks.map((task) => task.id);
    newTask.id = Math.max(...ids) + 1;
    newTask.isComplete = false;
    newTask.createdAt = new Date();
    newTask.updatedAt = new Date();

    tasks.push(newTask);
    res.status(201).send(newTask);
});


app.patch('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id == id);
    if(task){
        Object.keys(req.body).forEach((key) => {
            task[key] = req.body[key];
        });
        task.updatedAt = new Date();
        res.send(task);
    }else{
        res.status(404).send({message: 'Cannot find given id'});
    }
});


app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = tasks.findIndex((task) => task.id === id);
    if(idx >= 0){                       //id가진 task없으면 -1이 되므로
        tasks.splice(idx, 1);           //index가 idx로 부터 요소 1개 지움
        res.sendStatus(204);
    }else{
        res.status(404).send({message: 'Cannot find given id.'});
    }
})

app.listen(3000, () => console.log('Server Started'));


//여기서 tasks가 가상의 파일이므로 오류 발생; 코드만 참고
