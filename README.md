# service-web-store

**service-web-store** contains the backend service that will store and serve the database, and provide endpoints to access the data.

### 1. Navigate to our newly forked directory

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

> npm install pg express<br>

:information_source: *| node package manager | install | the package named pg | the package named express|*

The references for both of these packages are added to package.json, and their source bits are stored in the corresponding folders inside of the node_modules subdirectory.

:information_source: *The postgres package in npm (pg) isn't the actual database engine, it is the middleware between the node service and the database.  We still have to install and configure postgres on linux, using aptitude.

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


### 6. Create a new table in the db!

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

Remember the node install we did?  Now let's get it running.  When we initiated the 





00000000








tables:

CREATE TABLE "cartitems" (
    "cartItemId" SERIAL,
    "cartId" integer references carts(cartID),
    "productId" integer NOT NULL,
    price integer NOT NULL
);

CREATE TABLE carts (
    "cartId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE orders (
    "orderId" SERIAL,
    "cartId" integer NOT NULL,
    name text NOT NULL,
    "creditCard" text NOT NULL,
    "shippingAddress" text NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE products (
    "productId" SERIAL,
    name text NOT NULL,
    price integer NOT NULL,
    image text NULL,
    "description" text NOT NULL
    
);

CREATE TABLE customer (
    "customerId" SERIAL,
    name text NOT NULL,
    address text NOT NULL
    
);

insert into products(name, price, description) values('hat',4.00,'A nice hat');

