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
            return reject({
                authStatus:USERPASSWORDINCORRECT
            });
        }
        else{
            return resolve( {
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
            return resolve( {
            authStatus:USERCREATESUCCESS,
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
            bookmarks:results
            });
        }      
    });
});

}

module.exports = {authUser,checkUser,createUser,connectDatabase,getBookmarks,getTodos}