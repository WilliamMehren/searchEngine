const express = require("express");
const mysql = require("mysql2")
const util = require("util")
const app = express();

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pickle123!"
})
const query = util.promisify(conn.query).bind(conn);

app.get("/search",async (req,res)=>{
    let search = req.query.search;
    let sites = await query(`SELECT * FROM browserdata.sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%'`)
    res.send(sites);
});
