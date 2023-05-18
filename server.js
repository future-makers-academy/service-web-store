const dbclient = require('./dbconnection.js')
const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');
var fs = require('fs');

if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    },
  });

  const session = require('express-session');
  const PgSession = require('connect-pg-simple')(session);

    const sessionOptions = {
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: new PgSession({              
        pool: dbclient,
        tableName: 'session',
        }),
        cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24,
        },
    };
    
    app.use(session(sessionOptions));
    app.use('/images', express.static('images'));

    app.listen(8080, ()=>{
        console.log("Server is now listening at port 8080");
        //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
    })


dbclient.connect()


const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    next();
  };



  app.get('/products', (req, res)=>{
    
    try{

        var imageBaseUrl = req.protocol + "://" + req.headers.host + "/images/";
        
        dbclient.query(`SELECT
            name
            , description
            , price
            , '${imageBaseUrl}' || image_path
            FROM products`, (err, result)=>{
            
            if(!err){
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
        dbclient.end;
    } catch(err){
        console.log(err);
    }
})

app.get('/product/:id', (req, res)=>{
    dbclient.query(`SELECT
        name
        , description
        , price
        , '${imageBaseUrl}' || image_path
    FROM products
    WHERE id = ${req.params.id}`, (err, result)=>{
        if(!err){
            res.status(200).send(result.rows);
        }
    });
    dbclient.end;
})

app.post('/product', upload.single('image'), (req, res)=>{    

      dbclient.query(
        `INSERT INTO products(
                name
                , description
                , price
                , image_path
            )
            VALUES(
                '${req.body.name}'
                ,'${req.body.description}'
                ,${req.body.price}
                ,'${req.file.filename}'
            )
            RETURNING *`, (err, result)=>{
            if(!err){
                console.log("success!");
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})


app.put('/product/:id',  upload.single('image'), (req, res)=>{    

    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let id = req.params.id;

    dbclient.query(
        `UPDATE products
         SET name = '${name}', price = ${price}, 
         image_path = '${image}', description = '${description}'
         WHERE id = ${id}`,
        (err, result)=>{
            
            if(!err){
                console.log("success!");
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})



app.delete('/product/:id', requireLogin, (req, res)=>{
    let id = req.params.id;
    dbclient.query(`DELETE from PRODUCTS where id = ${id}`, (err, result)=>{
        if(!err){
            console.log("deletion success!");
            res.send(result.rows);
        } else {
            console.log(err);
        }
    });
    dbclient.end;
})

app.get('/testproductadd', (req, res)=>{
    
    res.sendFile(__dirname + '/productPOSTtest.html');
})

app.get('/testproductget', (req, res)=>{
    
    

    dbclient.query(`Select * from products`, (err, result)=>{
        if(!err){            
            var html = "<html>";

            result.rows.forEach(row => {

                html += `<p>RECORD: ${row.id} | Name: ${row.name} | Description: ${row.description}  | Image: <img src='images/${row.image_path}'> |</p><br>`;
            });

            html += "</html>";
            
            res.send(html);
        }
    });
    dbclient.end;    
})



app.get('/cart', (req, res)=>{
     dbclient.query(`Select * from cart_items WHERE user_id = ${req.session.userId}`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
})

app.post('/cart/add', (req, res) =>{

    dbclient.query(`INSERT INTO cart_items (user_id, product_id, quantity) 
        VALUES (${req.session.userId}, ${req.body.product_id}, ${req.body.quantity})`
        , (err, result)=>{
            if(!err){
                res.status(200).send(result.rows);
            } else {
                res.status(500).json({ message: 'Server error' });
            }
        });
    dbclient.end;
    
})

app.get('/cart/item/:id', (req, res)=>{
    let id = req.params.id;
    dbclient.query(`SELECT * FROM cart_items WHERE user_id = ${req.session.userId} AND id = ${id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    dbclient.end;
})

app.delete('/cart/item/:id', (req, res)=>{
    let id = req.params.id;
    dbclient.query(`DELETE from cart_items WHERE user_id = ${req.session.userId} AND id = ${id}`, (err, result)=>{
        if(!err){
            res.status(200).send("Deleted " + req.params.id);
        } else {
            console.log(err);
        }
    });
    dbclient.end;
})

app.get('/carts', (req, res)=>{
    dbclient.query(`Select * from carts`, (err, result)=>{
        if(!err){
            res.status(200).send(result.rows);
        }
    });
    dbclient.end;
});

 app.get('/orders', (req, res)=>{
     dbclient.query(`Select * from orders`, (err, result)=>{
         if(!err){
             res.status(200).send(result.rows);
         }
     });
     dbclient.end;
 })

 app.get('/users', (req, res)=>{
     dbclient.query(`Select * from users`, (err, result)=>{
         if(!err){
             res.status(200).send(result.rows);
         }
     });
     dbclient.end;
 })

 app.delete('/user/:id', (req, res)=>{

    console.log("DELETE from users WHERE id = " + req.params.id);

    dbclient.query("DELETE from users WHERE id = " + req.params.id, (err, result)=>{
        if(!err){
            console.log("success!");
            res.status(200).send(result.rows);
        } else {
            console.log(err);
        }
    });
    dbclient.end;
})

app.put('/users/:email', (req, res)=>{    
    let email = req.params.email;
    dbclient.query(
        `UPDATE products(name, price, image, description)
         SET name = '${name}', price = ${price}, 
         image = '${image}', description = '${description}'
         WHERE id = ${id}`,
        (err, result)=>{
            if(!err){
                console.log("success!");
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})

app.post('/user', async (req, res) => {

    dbclient.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, result)=>{
        if(!err){
            
            if(result.rowCount > 0){
                dbclient.end;
                return res.status(409).json({ message: 'Email already registered' });
            } else {


                console.log(req.body);
                const hashedPassword = bcrypt.hashSync(req.body.password, 10);

                console.log(hashedPassword);


                dbclient.query(`INSERT INTO users(name, email, password) 
                VALUES ('${req.body.name}','${req.body.email}','${hashedPassword}')`, (err, result)=>{
                    if(!err){
                        
                        return res.status(200).send(result.rows);

                    } else {
                        console.log(err);
                        res.status(500).json({message: 'Unable to register' + req.body.name});
                    }
                });

            }
        } else {
            console.log(err);
            res.status(500).json({message: 'Unable to register' + req.body.name});
        }
    });

    dbclient.end;

})


app.post('/users/reset/:email', (req, res) => {

    try {
        
        const result = dbclient.query(`SELECT * FROM users 
        WHERE email = '${req.params.email}'`, (err, result)=>{

            if(!err){

                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Email not found' });
                } else {

                    const resetToken = crypto.randomBytes(32).toString('hex');

                    dbclient.query(`INSERT INTO password_reset_tokens (user_id, token, expires_at) 
                    VALUES ($1, $2, NOW() + INTERVAL \'1 day\')`, 
                        [result.rows[0].id, resetToken], (err, result)=>{
                        if(!err){
                            res.status(200).send(result.rows);
                            //We shouldn't actually expose this to the front end,
                            // but instead the backend should send the mail directly
                            //if we have time we can look into thise
                        }
                    })

                }

            }
            
        });

    } catch (error) {
        console.error('Error generating reset token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});


app.put('/users/reset/:token', (req, res) => {

    try {      
        dbclient.query(`SELECT * FROM password_reset_tokens 
        WHERE expires_at > NOW()
        AND token = '${req.params.token}'`, (err, result)=>{
            if(!err){

                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Valid token not found' });
                } else {

                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                    var userid = result.rows[0]["user_id"];
                
                    dbclient.query(`UPDATE users SET password = '${hashedPassword}' 
                        WHERE id = ${userid}`, (err, result)=>{
                        
                        if(!err){

                            dbclient.query(`DELETE FROM  password_reset_tokens 
                            WHERE user_id = ${userid}`, (err, result)=>{
                                return res.status(200).send(result.rows);
                                });
                        }
                    })

                }

            }            
        });  
    } catch (error) {
        console.error('Error generating reset token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});


app.post('/login', (req, res) => {
        
    try {
                    
        dbclient.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, (err, result)=>{
        
        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
            } else {
            const user = result.rows[0];
            const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid email or password' });
            } else {
                req.session.userId = user.id;
                return res.status(200).json({ message: 'Login successful' });
            }

            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }

});



app.get('/customers', (req, res)=>{
    dbclient.query(`Select * from customers`, (err, result)=>{
        if(!err){
            res.status(200).send(result.rows);
        }
    });
    dbclient.end;
})


app.post('/customers', upload.single('image'), (req, res)=>{    

      dbclient.query(
        `INSERT INTO customers(
                name
                , email
                , address
                , phone
            )
            VALUES(
                '${req.body.name}'
                ,'${req.body.email}'
                ,${req.body.address}
                ,'${req.file.phone}'
            )`, (err, result)=>{
            if(!err){
                console.log("success!");
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})

app.put('/customer/:id', (req, res)=>{    
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let id = req.params.id;
    dbclient.query(
        `UPDATE customers
         SET name = '${name}', email = ${email}, 
         address = '${address}', phone = '${phone}'
         WHERE id = ${id}`,
        (err, result)=>{
            if(!err){
                console.log("success!");
                res.status(200).send(result.rows);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})