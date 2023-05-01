const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "sean",    
    port: 5432,
    database: "store",
    password: "asdf"
})

module.exports = client