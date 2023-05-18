const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "admin",    
    port: 5432,
    database: "admin",
    schema: "web_store",
    password: "admin"
})

module.exports = client