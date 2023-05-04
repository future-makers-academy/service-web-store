const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",    
    port: 5432,
    database: "dbstore",
    password: "5up3r53cur3"
})

module.exports = client