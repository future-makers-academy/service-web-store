ALTER USER admin PASSWORD 'admin';

CREATE DATABASE web_store;
GRANT ALL ON DATABASE web_store TO admin;

CREATE USER service_web_store WITH PASSWORD 'service_web_store';

CREATE SCHEMA IF NOT EXISTS web_store AUTHORIZATION admin;
GRANT ALL ON SCHEMA web_store TO admin;
GRANT ALL ON SCHEMA web_store TO service_web_store;

ALTER ROLE service_web_store SET search_path = web_store;