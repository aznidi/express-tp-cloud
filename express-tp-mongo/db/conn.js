const { MongoClient } = require("mongodb");

const connectionString = "mongodb://127.0.0.1:27017";

const client = new MongoClient(connectionString);

let db;
async function connectToDatabase() {
    try{
        await client.connect();
        db = client.db("employes_db");
        console.log('Connected to the database successfully!');
        return db;
    }catch(error){
        console.error('Failed to connect to the database:', error);
    }
}


module.exports = connectToDatabase;
