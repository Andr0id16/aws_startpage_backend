const {authUser,createUser,connectDatabase} = require( "./database")

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


app.listen(PORT, ()=>{
    console.log(`Startup page backend server running on port ${PORT}`);
})
