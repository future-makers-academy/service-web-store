const dbclient = require('./dbconnection.js')
const express = require('express');

const bodyParser = require("body-parser");
const app = express();

//app.use(bodyParser.json());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
    //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
})

dbclient.connect()
app.get('/products', (req, res)=>{
    dbclient.query(`Select * from products`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    dbclient.end;
})

app.get('/cartitems', (req, res)=>{
     dbclient.query(`Select * from cartitems`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })
 app.get('/carts', (req, res)=>{
     dbclient.query(`Select * from carts`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })
 app.get('/orders', (req, res)=>{
     dbclient.query(`Select * from orders`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })
 app.get('/customer', (req, res)=>{
    console.log("DELETE");
     dbclient.query(`Select * from customer`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })
 
 app.post('/customer', (req, res)=>{

    console.log(req.body);
    dbclient.query("insert into customer(name, address) values ('" + req.body.name + "','" + req.body.address + "')", (err, result)=>{
        if(!err){
            console.log("success!");
            res.send(result);
        }
    });
    dbclient.end;
})

app.delete('/customer', (req, res)=>{
    
    dbclient.query("delete from customer where customerId = '" + req.body.id + "'", (err, result)=>{
        if(!err){
            console.log("success!");
            res.send(result);
        }
    });
    dbclient.end;
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/test.html');
})
