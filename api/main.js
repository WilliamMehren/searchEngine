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

app.get("/post/:type",async (req,res)=>{
    let type = req.params.type
    let url = req.query.url
    let dbres
    switch (type){
        case "site":
            let name = req.query.name
            let title = req.query.title
            let text = req.query.text
            dbres = await query(`INSERT INTO browserdata.sites (url,name,title,text) VALUES ("${url}","${name}","${title}","${text}");`)
        case "image":
            //du må ta med siden bildet kommer fra
            let imageParentUrl = req.query.parentUrl
            let imageParentSite = await query(`SELECT * FROM browserdata.sites WHERE url ="${imageParentUrl}"`)
            if (imageParentSite < 0){
                res.send("siden bildet tilhører kan ikke bli funnet")
            } else {
                let site_id = imageParentSite[0].site_id
                let alt = req.query.alt
                dbres = await query(`INSERT INTO browserdata.images (site_id,url,alt) VALUES ("${site_id}","${url}","${alt}");`)
        }
        case "video":
            //du må ta med siden bildet kommer fra
            let videoParentUrl = req.query.parentUrl
            let videoParentSite = await query(`SELECT * FROM browserdata.sites WHERE url ="${videoParentUrl}"`)
            if (videoParentSite < 0){
                res.send("siden bildet tilhører kan ikke bli funnet")
            } else {
                let site_id = videoParentSite[0].site_id
                dbres = await query(`INSERT INTO browserdata.images (site_id,url) VALUES ("${site_id}","${url}");`)
            }
        case "link":
            //gidder ikke å lage denne akkurat nå 
    }
    res.send(dbres)
    

});


app.get("/search",async (req,res)=>{
    let search = req.query.query;
    let sites = await query(`SELECT * FROM browserdata.sites WHERE title LIKE '%${search}%' OR TEXT LIKE '%${search}%'`);
    res.send(sites);
});
app.get("/images",async ()=>{
    let search = req.query.query
    let images = await query(`SELECT * from browserdata.images WHERE alt LIKE '%${search}%'`)
    res.send(images)
});
app.listen(5000,()=>{
    console.log("listening on port 5000");
})