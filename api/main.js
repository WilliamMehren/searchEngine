const express = require("express");
const mysql = require("mysql2")

const app = express();

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pickle123!"
})


app.get("/search",(req,res)=>{
    let query = res.query.
});


