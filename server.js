const dbclient = require('./dbconnection.js')
const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

    app.listen(3000, ()=>{
        console.log("Sever is now listening at port 3000");
        //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
    })


dbclient.connect()

app.get('/', (req, res)=>{
    res.send("blah");
})

app.get('/products', (req, res)=>{
    dbclient.query(`Select * from products`, (err, result)=>{
        if(!err){
            res.send(result.rows);
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
            )`, (err, result)=>{
            if(!err){
                console.log("success!");
                res.send(result);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})

app.put('/product/:id', (req, res)=>{    
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description;
    let id = req.params.id;
    dbclient.query(
        `UPDATE products(name, price, image, description)
         SET name = '${name}', price = ${price}, 
         image = '${image}', description = '${description}'
         WHERE id = ${id}`,
        (err, result)=>{
            if(!err){
                console.log("success!");
                res.send(result);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})

app.delete('/product/:id', (req, res)=>{
    let id = req.params.id;
    dbclient.query(`DELETE from PRODUCT where id = ${id}`, (err, result)=>{
        if(!err){
            console.log("deletion success!");
            res.send(result);
        } else {
            console.log(err);
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
 });

 app.get('/carts', (req, res)=>{
     dbclient.query(`Select * from carts`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 });

 app.get('/orders', (req, res)=>{
     dbclient.query(`Select * from orders`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })




 app.get('/users', (req, res)=>{
     dbclient.query(`Select * from users`, (err, result)=>{
         if(!err){
             res.send(result.rows);
         }
     });
     dbclient.end;
 })

 app.delete('/users/:id', (req, res)=>{

    console.log("DELETE from users WHERE id = " + req.params.id);

    dbclient.query("DELETE from users WHERE id = " + req.params.id, (err, result)=>{
        if(!err){
            console.log("success!");
            res.status(200).send("Deleted " + req.params.id);
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
                res.send(result);
            } else {
                console.log(err);
            }
        });
    dbclient.end;
})

app.post('/users', async (req, res) => {

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
                        
                        return res.status(201).json({ message: 'User registered successfully' + req.body.name });

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

  });



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
                            return res.status(200).json(
                                { message: 'Password reset token generated', token: resetToken }
                            );
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
                                return res.status(200).json(
                                    { message: 'Password updated' }
                                );
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