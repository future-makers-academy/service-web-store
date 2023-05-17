ALTER USER admin PASSWORD 'admin';

CREATE DATABASE web_store;
GRANT ALL ON DATABASE web_store TO admin;

CREATE USER service_web_store WITH PASSWORD 'service_web_store';

CREATE SCHEMA IF NOT EXISTS web_store AUTHORIZATION admin;
GRANT ALL ON SCHEMA web_store TO admin;
GRANT ALL ON SCHEMA web_store TO service_web_store;

ALTER ROLE service_web_store SET search_path = web_store;

CREATE TABLE order_items
(
    id SEQUENCE,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL    
);

CREATE TABLE orders
(
    id SEQUENCE,
    user_id integer NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE public.password_reset_tokens
(
    id SEQUENCE,
    user_id bigint NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp DEFAULT now(),
    expires_at timestamp NOT NULL
);

CREATE TABLE public.products
(
    id SEQUENCE,
    name text NOT NULL,
    description text ,
    price numeric NOT NULL
    --imageblob bytea,
    --image_path text,    
);

CREATE TABLE public.users
(
    id SEQUENCE,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

