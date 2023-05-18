# service-web-store

**service-web-store** contains the backend service that will store and serve the database, and provide endpoints to access the data.

### 1. Navigate to our newly forked directory

Open a terminal in vscode, by clicking Terminal > New Terminal.

In the terminal type:
> cd service-web-store 

:information_source: *| change directory to a directory named | service-web-store |*

### 2. Install node.js (npm comes with it)

> sudo apt-get install nodejs<br>

:information_source: *| superuser do | use linux's aptitude package manager to get and install | the nodejs package for linux |*

**Aptitude** (apt) is **linux's** package manager, while **NPM** is **node's** package manager.  We will use it to install packages that will host the postgres database, and the expressjs framework that will be used to provide our REST endpoints (api).

### 3. Initialize this directory to be managed by NPM

> npm init<br>

:information_source: *| node package manager | initialize |*

This will prompt for all of the basics needed for our service, and create a package file (package.json) that will store the application specifics, as well as an index for the packages in use.

Populate the prompt like so (accept defaults in parenthesis by simply hitting enter):
> package name: service-web-store<br>
> version: 1.0.0<br>
> description: A web store backend service.<br>
> entry point: server.js<br>
> test command: {blank}<br>
> git repository: https://github.com/future-makers-academy/service-web-store.git<br>
> keywords: store<br>
> author: {YOUR NAME}<br>
> license: ISC<br>

Notice a newly created package.json file with the information that you just entered, as well as a new folder called node_modules, where the actual packages are stored.


### 4. Install postgres and express from NPM

> npm install express<br>

:information_source: *| node package manager | install | the package named express|*

The references for both of these packages are added to package.json, and their source bits are stored in the corresponding folders inside of the node_modules subdirectory.



### 5. Install postgres db engine from Apt

> sudo apt install postgresql postgresql-contrib<br>

:information_source: *| super user do | use aptitude | install | the package named postgresql | the package named postgresql-contrib (extra features)*


The installation procedure created a user account called postgres that is associated with the default Postgres role. We will use this account to create and run the db.

> sudo su postgres<br>

:information_source: *| super user do | switch user | to the user named postgres|*

Notice our prompt is now prefixed with postgres@ to indicate who is issuing commands.

We will start interacting with postgres itself with the psql command.

### 6. Create a new db, table, and record!

We will create the db by first entering the psql interface, and we are now issuing SQL commands.  

> psql<br>
> create database dbstore owner=postgres;

:information_source: *| create a new | database | name it dbstore | make the owner of the db the autmatically created user named postgres | the semicolon (;) will execute the command that precedes it (this will be the last reminder) |*



>CREATE TABLE products (<br>
&nbsp;&nbsp;&nbsp; productid SERIAL,<br>
&nbsp;&nbsp;&nbsp; name text NOT NULL,<br>
&nbsp;&nbsp;&nbsp; price integer NOT NULL,<br>
&nbsp;&nbsp;&nbsp; image text NULL,<br>
&nbsp;&nbsp;&nbsp; description text NOT NULL<br>
);


:information_source: *| create a new | table | name it products | add these columns and types |*

> select * from products;

:information_source: *| select data from | every column | from | the table named products |*

Notice the result is an empty table.  Let's insert a record.

> insert into products(name, price, description) values('hat',4.00,'A nice hat');

:information_source: *| insert data | into the table named products | the destination columns | the source data |*

> select * from products;


Now we see some data!  Now let's hook this up with our node app!

You can leave the psql interface by typing 

> \q

And then, leave the postgres user's shell by typing 

> exit



### 7. Create a simple web server

Remember the node install we did?  Now let's get it running.  

Let's use a few linux commands in the process.  First let's create a file named server.js.  You can do this with the touch command.
> touch server.js

:information_source: *| run the touch command | using server.js |*

This will create a new empty file called server.js.  To edit it we will use nano, linux's built in text editor.

> sudo nano server.js

:information_source: *| run the touch command | using server.js |*

This will open the blank file in the terminal based editor.   Enter the following in the file.
> const express = require('express');
express is what we will use to process our rest calls


to leave the nano editor you will have to hit 
> ctrl x 

and then to save the changes you made, hit
> y
and then 
> enter

This is a cool, simple and basic way to edit our text files.  But lets use VSCode to take advantage of some of the features!

Activate the Explorer tab of VSCode, and open the service-web-store directory.  You should see your server.js file.  Open it up, and we can add the following code:
> const bodyParser = require("body-parser");

the body parser is used to get variables from the http request

> const app = express();
> app.use( bodyParser.json() );   
> app.use(bodyParser.urlencoded({ 
>   extended: true
> })); 

declare the app to be express, and have it use the body parser to support parsing both JSON and url encoded data

> app.listen(3000, ()=>{
>     console.log("Sever is now listening at port 3000");
>     //sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
> })




set our app to run on port 3000, and log when it's running to the console



> app.get('/', (req, res)=>{
>     res.send("Hello world!");
> })

And finally create a route to serve!  This means that when an http get request is sent to the base url ( / ) the server will respond with the hello world message.

This is the script that node will process to run our server.  In the terminal, type:

>node server.js

:information_source: *| run node | using server.js |*

The terminal should log that it is now listening!  (If not there is probably an issue with the script)
Congratulations you are now running a server.  Now personalize it!  Change hello world to a greeting with your name or business.  
* i.e. "Welcome to Sean's Store Rest API"


### 8. Hookup the Database and create an endpoint

Now it's time to hook up the database.  In the terminal, use NPM to install the pg package.
> npm install pg

The postgres package in npm (pg) isn't the actual database engine, it is the middleware between the node service and the database.  Note the difference, pg is the NPM package, postgresql is the aptitude package.

Create a new file using VSCode's explorer new file button.  In this file enter the text:

> const {Client} = require('pg')
> 
> const client = new Client({
>     host: "localhost",
>     user: "postgres",    
>     port: 5432,
>     database: "dbstore"
> })
> 
> module.exports = client


We will name this file dbconnection.js

This will be the script that configures our node server to use the postgres database we created.

Now, open the server.js file and we will connect to the dbclient.

> const dbclient = require('./dbconnection.js')

this will include the dbconnection script in the server process.

> dbclient.connect();

start our postgres client

> app.get('/products', (req, res)=>{
>     dbclient.query(`Select * from products`, (err, result)=>{
>         if(!err){
>             res.send(result.rows);
>         }
>     });
>     dbclient.end;
> })
> 


Here is a new route, that will respond to a get request at the /products url.

Save the files, and restart your node server


:information_source: *ctrl c will stop a process from running in most linux commands, use it to stop your server and then restart it*
:information_source: *you can use the up and down arrows to search through your shell history.*

> node server.js

Now navigate to the products url.  You ought to see a JSON representation of the record we added to the products table.


### 9. Add all the database tables and create endpoint for each.

Repeating the process in step 6 create four new tables in the database with the following commands:

> CREATE TABLE cartitems (
>     "cartItemId" SERIAL,
>     "cartId" integer,
>     "productId" integer NOT NULL,
>     price integer NOT NULL
> );
> 
> CREATE TABLE carts (
>     "cartId" integer NOT NULL,
>     "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL
> );
> 
> CREATE TABLE orders (
>     "orderId" SERIAL,
>     "cartId" integer NOT NULL,
>     name text NOT NULL,
>     "creditCard" text NOT NULL,
>     "shippingAddress" text NOT NULL,
>     "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL
> );
> 
> CREATE TABLE customers (
>     "customersId" SERIAL,
>     name text NOT NULL,
>     address text NOT NULL
>     
> );



### 10. Create endpoints for each table

Repeating the process to create an endpoint in step 8, create GET endpoints for each of the tables.

> app.get('/cartitems', (req, res)=>{
>     dbclient.query(`Select * from cartitems`, (err, result)=>{
>         if(!err){
>             res.send(result.rows);
>         }
>     });
>     dbclient.end;
> })
> app.get('/carts', (req, res)=>{
>     dbclient.query(`Select * from carts`, (err, result)=>{
>         if(!err){
>             res.send(result.rows);
>         }
>     });
>     dbclient.end;
> })
> app.get('/orders', (req, res)=>{
>     dbclient.query(`Select * from orders`, (err, result)=>{
>         if(!err){
>             res.send(result.rows);
>         }
>     });
>     dbclient.end;
> })
> app.get('/customers', (req, res)=>{
>     dbclient.query(`Select * from customers`, (err, result)=>{
>         if(!err){
>             res.send(result.rows);
>         }
>     });
>     dbclient.end;
> })
> 

Once you run the server and visit the endpoint, you should see an empty array for the tables that don't have records.  Let's get some records in those tables!
Notice the SELECT command we are using.  This is sql that will return records.

### 11. Create post/insert endpoint

Now we want to insert some records, so we will create some new endpoints, but instead of using SELECT we will use INSERT.  And since we will be taking data from the client to insert, instead of a GET route in our node server, we will create a new POST route like such.


> app.post('/customers', (req, res)=>{
>     dbclient.query("insert into customers(name, address) values ('" + req.body.name + "','" + req.body.address + "')", (err, result)=>{
>         if(!err){
>             console.log("success!");
>             res.send(result);
>         }
>     });
>     dbclient.end;
> })



### 12. Test the post/insert functionality.

Now we can test the endpoint using a simple ajax post!  Let's add a new html file with a simple form to add a record, just for testing purposes.

Create a new file called test.html.  Add the following to the file:

>   <form action="customers" method="post">
>     <input type="text" name="name" value="{Your name}" />
>     <input type="text" name="address" value="{Your Country}" />
>     <input type="submit" />
>   </form>

Notice the method is post.  Submitting this form will send the data as a POST request to the customers endpoint/route.  


Now let's change the default root site from our "Hello World" greeting to this form.  Remember, this is not our front end, just a little testing page.

In server.js go to your root site, and change the contents from 
> res.send("Hello world.");
to 
> res.sendFile(__dirname + '/test.html');

This will basically send the newly created html file to the client.

Save All, and restart your node server.  Navigate to the base page and fill out and submit the form.  Hopefully it worked!
You should see the response from the insert process.  We can change this to be whatever we want, of course.

Now navigate to the customers page, and it should return your newly submitted data.


### 12. Create the rest of the endpoints for the remaining tables.


Repeating the process to create an endpoint in step 11, create POST endpoints for each of the tables.


### 13.  Finishing the API

Create DELETE endpoints for each of the tables.  Here, the http request method and the sql command are named the same!   Here is an example for the customers table:

> app.delete('/customers/:id', (req, res)=>{
>     dbclient.query("delete from customers where customersId = " + req.body.id, (err, result)=>{
>         if(!err){
>             console.log("success!");
>             res.send(result);
>         }
>     });
>     dbclient.end;
> })

You have created your very first RESTful api!  Now a front-end can be attached to manage the data.