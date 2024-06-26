const express = require("express");
const mysql = require("mysql2")
const util = require("util")
const cors = require("cors");
const app = express();

//database kobling
const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pickle123!",
    database:"browserdata"
})
const query = util.promisify(conn.query).bind(conn);

app.use(cors())

function generate_key(length){
    //lag en tilfeldig nøkkel med tilfeldige bokstaver i øsnket lengde
    let res = "";
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++){
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res
}
async function user_verify(userid,key){
    //veridiser bruker med id og nøkkel
    let verified = false;
    let dbres = await query(`SELECT * FROM users WHERE user_id=${userid}`);
    if (dbres[0].user_key == key){ 
        verified = true;
    }
    return verified
}
app.get("/post/:type",async (req,res)=>{
    //hent request informasjon
    let type = req.params.type
    let url = req.query.url
    let dbres
    switch (type){
        //gi nødvendig informasjon til databasen
        case "site":
            //post informasjonen til siden
            let name = req.query.name
            let title = req.query.title
            let text = req.query.text
            dbres = await query(`INSERT IGNORE INTO sites (url,name,title,text) VALUES ("${url}","${name}","${title}","${text}");`)
            break;
        case "image":
            //du må ta med siden bildet kommer fra
            let imageParentUrl = req.query.parentUrl
            let imageParentSite = await query(`SELECT * FROM sites WHERE url ="${imageParentUrl}"`)
            console.log(imageParentSite)
            if (imageParentSite < 0){
                res.send("siden bildet tilhører kan ikke bli funnet")
            } else {
                let site_id = imageParentSite[0]["site_id"]
                let alt = req.query.alt
                dbres = await query(`INSERT IGNORE INTO images (site_id,url,alt) VALUES ("${site_id}","${url}","${alt}");`)
            }break;
        case "video":
            //du må ta med siden bildet kommer fra
            let videoParentUrl = req.query.parentUrl
            let videoParentSite = await query(`SELECT site_id FROM sites WHERE url ="${videoParentUrl}"`)
            if (videoParentSite < 0){
                res.send("siden bildet tilhører kan ikke bli funnet")
            } else {
                let site_id = videoParentSite[0].site_id
                dbres = await query(`INSERT IGNORE INTO images (site_id,url) VALUES ("${site_id}","${url}");`)
            }
            break;
        case "link":
            //gidder ikke å lage denne akkurat nå 
            break;
    }
    res.send(dbres)
    

});
app.get("/search/:type",async (req,res)=>{
    //hent request
    let type = req.params.type;
    let search = req.query.query;
    let index = req.query.index;
    let limit = req.query.limit;
    let results
    let amount
    switch (type){
        //søk på databasen
        case "site":
            if (limit && index){
                results = await query(`SELECT * FROM sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%' LIMIT ${limit},${index}`);
                amount = await query(`SELECT count(*) AS COUNT FROM browserdata.sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%'`);
            } else {
                results = await query(`SELECT * FROM sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%'`);
                amount = await query(`SELECT count(*) AS COUNT FROM browserdata.sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%'`);
            }
            
            break
        case "image":
            
            break
        case "video":
            break
    }
    res.send({amount:amount,results:results});
    
});
app.get("/signup", async (req,res)=>{
    let username = ""
    let password = ""
    let key = generate_key(16)
    try{
        username = req.query.username
        password = req.query.password
    } catch{
        res.send("username and/or password not specified")
    }
    let dbres = await query(`INSERT IGNORE INTO users (username,password,user_key) VALUES ('${username}','${password}','${key}')`);
    if (dbres){
        let dbres2 = await query(`SELECT * FROM users WHERE user_key = "${key}"`);
        console.log(dbres2)
        if (dbres2){
            res.send({key:key,userid:dbres2[0].userid})
        }
    } else{
        res.send({error:"Something went wrong"})
    }
    
});
app.get("/login",async (req,res)=>{
    
    let username = ""
    let password = ""
    try{
        username = req.query.username
        password = req.query.password
    } catch{
        res.send("username and/or password not specified")
    }
    let dbres = await query(`SELECT * FROM users WHERE username='${username}' AND password='${password}'`)
    if (dbres.length > 0){res.send({userid: dbres[0].userid,key: dbres[0].user_key});}
    else {res.send({successful:false});}
    
});
app.get("/user_edit",async  (req,res)=>{
    let key = req.query.key;
    let userid = req.query.userid;
    let username = req.query.username;
    let password = req.query.password;
    if (user_verify(userid,key)){
        let dbres = await query(`UPDATE users SET username = '${username}',password='${password}' WHERE userid = ${userid}`)
    }
    
});
app.get("/user/:id",async (req,res)=>{
    let id = req.params.id;
    let file = "";
    if (req.query.file){
        file = req.query.file;
        res.sendFile(`assets/users/${id}/${file}`,fileOptions);
    } 
});
app.listen(5000,()=>{
    console.log("listening on port 5000");
})
