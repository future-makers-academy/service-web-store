# service-web-store

tables:

CREATE TABLE "cartItems" (
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

