const {config} = require("./env")
const mysql = require("mysql2")

const USERNOTFOUND = 1404
const USERPASSWORDINCORRECT = 1401
const USERAUTHSUCCESS = 1200
const ERROROCCURRED =  1500
const USERCREATESUCCESS = 1200
const DUPUSERERROR = 1409
const OPSUCCESS = 2200


var con;
try{
con = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database:config.DB,
  port:config.DB_PORT
});

}catch(e){
    console.error(e)
}

function connectDatabase(){
    con.connect((error) => {
        if (error) {
          console.error('Error connecting to database: ', error);
        } else {
          console.log('Connected to database.');
        }
      });
}
function authUser(email,password){

    return new Promise((resolve,reject)=>{ con.query(`SELECT * FROM ${config.USER_TABLE} WHERE email=?`,[email],function(err, results) {
        if(err){
            reject({
                authStatus:ERROROCCURRED,
                error:err.sqlMessage,
            });
        }
        else if(results.length == 0){
            reject({
                authStatus:USERNOTFOUND
            }); 
        }
        else if(results[0].password != password){
            reject({
                authStatus:USERPASSWORDINCORRECT
            });
        }
        else{
            resolve( {
            authStatus:USERAUTHSUCCESS,
            });
        }      
    });
});
}


function checkUser(){


}

function createUser(email,username,password){

    return new Promise((resolve,reject)=>{ con.query(`INSERT INTO ${config.USER_TABLE}(email,password,username) values(?,?,?)`,[email,password,username],function(err, results) {
        if(err){
            if(err.code === "ER_DUP_ENTRY"){
                reject({
                    authStatus:DUPUSERERROR,
                    error : err.sqlMessage
                });    
            }
            else{
                reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
                });
            }
        }
        else{
            resolve( {
            authStatus:USERCREATESUCCESS,
            });
        }      
    });
});

}



function createBookmarks(email,bookmarks){

    return new Promise((resolve,reject)=>{ 
        
        let values = ""
        for(const [id,bookmark] of bookmarks.entries()){
            values+=`("${email}","${bookmark}",${id}),`
        }
        values = values.substring(0,values.length - 1);
        console.log(`INSERT IGNORE INTO ${config.BM_TABLE}(email,bookmark,id) VALUES ${values}`);
        con.query(`INSERT IGNORE INTO ${config.BM_TABLE}(email,bookmark,id) VALUES ${values}`,function(err, results) {
        if(err){
            console.log("error")
            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            console.log("success")

            resolve( {
            authStatus:OPSUCCESS,
            });
        }      
    });
});

}
function getBookmarks(email){

    return new Promise((resolve,reject)=>{ con.query(`SELECT * FROM ${config.BM_TABLE} where email=?`,[email],function(err, results) {
        if(err){

            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            return resolve( {
            authStatus:OPSUCCESS,
            bookmarks:results
            });
        }      
    });
});

}

function createTodos(email,todos){

    return new Promise((resolve,reject)=>{ 
        
        let values = ""
        for(const [id,todo] of todos.entries()){
            values+=`("${email}","${todo}",${id}),`
        }
        values = values.substring(0,values.length - 1);
        console.log(`INSERT IGNORE INTO ${config.TD_TABLE}(email,todos,id) VALUES ${values}`);
        con.query(`INSERT IGNORE INTO ${config.TD_TABLE}(email,todos,id) VALUES ${values}`,function(err, results) {
        if(err){
            console.log("error",err.sqlMessage)
            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            console.log("success")

            resolve( {
            authStatus:OPSUCCESS,
            });
        }      
    });
});

}
function getTodos(email){

    return new Promise((resolve,reject)=>{ con.query(`SELECT * FROM ${config.TD_TABLE} where email=?`,[email],function(err, results) {
        if(err){

            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            return resolve( {
            authStatus:OPSUCCESS,
            todos:results
            });
        }      
    });
});

}


function deleteBookmark(email,id){
    
    return new Promise((resolve,reject)=>{ con.query(`DELETE FROM ${config.BM_TABLE} where email=? AND id=?`,[email,id],function(err, results) {
        if(err){

            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            return resolve( {
            authStatus:OPSUCCESS,
            });
        }      
    });
});
}

function deleteTodo(email,id){
    
    return new Promise((resolve,reject)=>{ con.query(`DELETE FROM ${config.TD_TABLE} where email=? AND id=?`,[email,id],function(err, results) {
        if(err){

            reject({
                    authStatus:ERROROCCURRED,
                    error : err.sqlMessage
            });
            
        }
        else{
            return resolve( {
            authStatus:OPSUCCESS,
            });
        }      
    });
});
}


module.exports = {authUser,checkUser,createUser,connectDatabase,getBookmarks,getTodos,createBookmarks,createTodos,deleteBookmark,deleteTodo}