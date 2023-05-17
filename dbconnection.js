const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "admin",    
    port: 5432,
    database: "postgres",
    password: "admin"
})

module.exports = client