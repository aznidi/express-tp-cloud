const mysql = require("mysql2");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'SAAZwinners9305@',
    database: 'football',
})

module.exports = pool.promise();