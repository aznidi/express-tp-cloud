const mysql = require("mysql2")


const connection = mysql.createConnection({
    host: process.env.DB_SQL_HOST,
    port: process.env.DB_SQL_PORT,
    user: process.env.DB_SQL_USERNAME,
    password: process.env.DB_SQL_PASS,
    database: process.env.DB_SQL_NAME
});

try{
    connection.connect((err) => {
        if(err) throw err;
        console.log('Connected to mysql database successfully .');
    });
}catch(err)
{
    console.log("An error occurred while connecting to the database:", err);
}

module.exports = connection;
