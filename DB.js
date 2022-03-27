const Pool = require("pg").Pool;
const { Client } = require("pg");
console.log(process.env.DATABASE_URL)
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

module.exports = client;