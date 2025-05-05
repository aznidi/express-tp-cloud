const { MongoClient } = require('mongodb');

const connectionString = process.env.DB_URL || "mongodb://localhost:27017";
const dbname = process.env.DB_NAME || "tp_operations";
const client = new MongoClient(connectionString);

let db;

async function connect()
{
    try{
        await client.connect();
        db = client.db(dbname);
        console.log('Connected to the database:', dbname);

        return db;
    }catch(err)
    {
        console.log('An error occurred while connecting to the database:', err);
    }
}


module.exports = { connect, client };
