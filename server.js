const dbclient = require('./dbconnection.js')
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());


app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
    //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
})

dbclient.connect();

app.get('/products', (req, res)=>{
    dbclient.query(`Select * from products`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    dbclient.end;
})



app.get('/', (req, res)=>{
    res.send("Hello world!");
})
