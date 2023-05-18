ALTER USER admin PASSWORD 'admin';

CREATE SCHEMA IF NOT EXISTS web_store AUTHORIZATION admin;
GRANT ALL ON SCHEMA web_store TO admin;

ALTER ROLE admin SET search_path = web_store;

SET SCHEMA 'web_store';

CREATE TABLE order_items
(
    id              SERIAL          PRIMARY KEY,
    order_id        INTEGER         NOT NULL,
    product_id      INTEGER         NOT NULL,
    quantity        INTEGER         NOT NULL    
);

CREATE TABLE orders
(
    id              SERIAL          PRIMARY KEY,
    user_id         INTEGER         NOT NULL,
    status          TEXT            COLLATE pg_catalog."default" NOT NULL,
    created_at      TIMESTAMP       WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE password_reset_tokens
(
    id              SERIAL          PRIMARY KEY,
    user_id         INTEGER         NOT NULL,
    token           TEXT            COLLATE pg_catalog."default" NOT NULL,
    created_at      TIMESTAMP       DEFAULT now(),
    expires_at      TIMESTAMP       NOT NULL
);

CREATE TABLE products
(
    id              SERIAL      PRIMARY KEY,
    name            TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    price           NUMERIC     NOT NULL,
    image_path      TEXT        DEFAULT NULL
    --imageblob bytea,
);

CREATE TABLE users
(
    id              SERIAL      PRIMARY KEY,
    name            TEXT        NOT NULL,
    email           TEXT        NOT NULL,
    password        TEXT        NOT NULL,

    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE cart_items
(
    id              SERIAL      PRIMARY KEY,
    user_id         INTEGER     NOT NULL,
    product_id      INTEGER     NOT NULL,
    quantity        INTEGER     NOT NULL,

    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
        REFERENCES users(id),

    CONSTRAINT fk_product_id
        FOREIGN KEY(product_id)
        REFERENCES products(id)
);

CREATE TABLE customers (
    id              SERIAL      PRIMARY KEY,
    name            TEXT        NOT NULL,
    email           TEXT        NOT NULL UNIQUE,
    address         TEXT,
    phone           TEXT
);

CREATE TABLE "session" (
    "sid"           VARCHAR         NOT NULL COLLATE "default",
    "sess"          JSON            NOT NULL,
    "expire"        TIMESTAMP(6)    NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

