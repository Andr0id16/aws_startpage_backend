const {authUser,createUser,connectDatabase,getBookmarks,createBookmarks,getTodos,createTodos, deleteBookmark, deleteTodo} = require( "./database")

connectDatabase();
const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 3000;


app.use(cors())
app.use(express.json())

app.post("/login",(req,res)=>{

    let email = req.body.email;
    let password = req.body.password;

    authUser(email,password).then((val)=>res.json(val)).catch((err)=>res.json(err))

})
app.post("/signUp",(req,res)=>{

    console.log(req.body)
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    console.log(email)
    createUser(email,username,password).then((val)=>res.json(val)).catch((err)=>res.json(err))

})

app.post("/bookmarks",(req,res)=>{

    console.log(req.body)
    let email = req.body.email;
    let bookmarks = req.body.bookMarks;
    
    console.log(email)
    console.log(bookmarks)
    createBookmarks(email,bookmarks).then((val)=>res.json(val)).catch((err)=>res.json(err))



})

app.get("/bookmarks/:email",(req,res)=>{

    let email = req.params.email;
    
    console.log(email)
    getBookmarks(email).then((val)=>{
        console.log(val)
        val = val.bookmarks;
        let bookmarks = []
        for(let i of val){
            bookmarks.push(i.bookmark)
        }
        res.json(bookmarks)
    }).catch((err)=>res.json(err))



})

// app.post("/todos",(req,res)=>{

//     console.log(req.body)
//     let email = req.body.email;
    
//     console.log(email)
//     getTodos(email).then((val)=>res.json(val)).catch((err)=>res.json(err))

// })

app.post("/todos",(req,res)=>{

    console.log(req.body)
    let email = req.body.email;
    let todos = req.body.todos;
    
    console.log(email)
    console.log(todos)
    createTodos(email,todos).then((val)=>res.json(val)).catch((err)=>res.json(err))



})
app.get("/todos/:email",(req,res)=>{

    let email = req.params.email;
    
    console.log(email)
    getTodos(email).then((val)=>{
        console.log(val)
        val = val.todos;
        let todos = []
        for(let i of val){
            todos.push(i.todos)
        }
        res.json(todos)
    }).catch((err)=>res.json(err))



})


app.get("/delete/todos/:email/:id",(req,res)=>{

    let email = req.params.email;
    let id = req.params.id;
    
    console.log(email)
    deleteTodo(email,id).then((val)=>{
        res.json(val)
    }).catch((err)=>res.json(err))



})

app.get("/delete/bookmarks/:email/:id",(req,res)=>{

    let email = req.params.email;
    let id = req.params.id;
    
    console.log(email)
    deleteBookmark(email,id).then((val)=>{
        res.json(val)
    }).catch((err)=>res.json(err))



})


app.listen(PORT, ()=>{
    console.log(`Startup page backend server running on port ${PORT}`);
})
