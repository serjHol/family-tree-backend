const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "jsanarchy",
    host: "localhost",
    port: 5432,
    database: "family_tree",
});

module.exports = pool;