const { Pool, Client } = require('pg')

console.log('Creating connection pool...')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vinmart',
    password: 'linh0402',
    port: 5432,
})

module.exports = pool