const express = require("express");
const mysql = require("mysql2");
const { MongoClient } = require("mongodb");
const data = require("./data/data.json");


const connectionString = "mongodb://localhost:27017";

const client = new MongoClient(connectionString);

const dbName = "clubs";

const dbMongo = client.db(dbName);



const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "SAAZwinners9305@",
    database: "clubs"
})

const db = pool.promise();



const PORT = 8000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({message: "Server is UP"});
})


/* JSON ROUTES TESTS */
app.get("/json/clubs", (req, res) => {
    res.status(200).json(data);
})

app.get("/json/clubs/:id", (req, res) => {
    const club = data.find(club => club.id === parseInt(req.params?.id))
    if(!club)
    {
        return res.status(404).json({success: false, message: "Club not found !", data: null})
    }

    res.status(200).json({success: true, message: "Club found !", data: club})
})

app.post("/json/clubs", (req, res) => {
    const { nom, country } = req.body;

    if(!nom || !country)
    {
        res.status(400).json({success: false, message: "Missing required fields", data: null})
    }

    const newClub = {
        id: Date.now(),
        nom,
        country
    }
    data.push(newClub);

    res.status(201).json({success: true, message: "Club created successfully", data: newClub});
})


app.put("/json/clubs/:id", (req, res) => {
    const id = parseInt(req.params?.id);

    const { nom, country } = req.body;

    const index = data.findIndex(club => club.id === id);

    if(index === -1)
    {
        return res.status(404).json({success: false, message: "Club not found !", data: null})
    }

    data[index] = {
        ...data[index],
        nom,
        country
    }


    res.status(200).json({success: true, message: "Club updated successfully", data: data[index]})
    
})

app.delete("/json/clubs/:id", (req, res) => {
    const id = parseInt(req.params?.id);

    const index = data.findIndex(club => club.id === id);

    if(index === -1)
    {
        return res.status(404).json({success: false, message: "Club not found !", data: null})
    }

    const deletedItem = data.splice(index, 1)[0];

    res.status(200).json({success: true, message: "Club deleted successfully", data: deletedItem})
})


// MYSQL ROUTES TESTS
app.get("/mysql/clubs", async(req, res) => {
    try{
       const [results] = await db.query("SELECT * FROM clubs");
       res.status(200).json({success: true, message: "Clubs fetched successfully", data: results});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})

app.get("/mysql/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params?.id);
        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }

        const [results] = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);

        if(results.length === 0)
        {
            return res.status(404).json({success: false, message: "Club not found !", data: null});
        }

        res.status(200).json({success: true, message: "Club found !", data: results[0]});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})


app.post("/mysql/clubs", async(req, res) => {
    try{
        const { nom, country } = req.body;

        if(!nom || !country)
        {
            return res.status(400).json({success: false, message: "Missing required fields", data: null});
        }

        const [results] = await db.query("INSERT INTO clubs(nom, country) VALUES(?, ?)", [nom, country]);

        if(results.affectedRows === 0)
        {
            return res.status(400).json({success: false, message: "Failed to create club", data: null});
        }

        const newClub = {
            id: results.insertId,
            nom,
            country 
        }

        res.status(201).json({success: true, message: "Club created successfully", data: newClub});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})


app.put("/mysql/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }

        const { nom, country } = req.body;

        const existedItem = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);

        if(existedItem.length === 0)
        {
            return res.status(404).json({success: false, message: "Club not found !", data: null});
        }


        await db.query("UPDATE clubs SET nom = ?, country = ? WHERE id = ?", [nom, country, id]);

        res.status(200).json({success: true, message: "Club updated successfully", data: {id, nom, country}});
        
    }catch(err){ 
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server Error", data: null });
    }
})


app.delete("/mysql/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }

        const existedItem = await db.query("SELECT * FROM clubs WHERE id = ?", [id]);

        if(existedItem.length === 0)
        {
            return res.status(404).json({success: false, message: "Club not found !", data: null});
        }
        

        await db.query("DELETE FROM clubs WHERE id = ?", [id]);

        res.status(200).json({success: true, message: "Club deleted successfully", data: existedItem[0]});
        
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})



/* MONGO ROUTES TESTS */
app.get("/mongo/clubs", async(req, res) => {
    try{
        const results = await dbMongo.collection("clubs").find({}).toArray();


        res.status(200).json({success: true, message: "Clubs fetched successfully", data: results});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})

app.get("/mongo/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }
        const query = {id: id};
        const result = await dbMongo.collection("clubs").findOne(query);

        if(!result)
        {
            return res.status(404).json({success: false, message: "Club not found !", data: null});
        }
        

        res.status(200).json({success: true, message: "Club found !", data: result});
        
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})


app.post("/mongo/clubs", async(req, res) => {
    try{
        const { nom, country } = req.body;

        if(!nom || !country)
        {
            return res.status(400).json({success: false, message: "Missing required fields", data: null});
        }

        const newClub = {
            id: Date.now(),
            nom,
            country
        }

        const results = await dbMongo.collection("clubs").insertOne(newClub);

        if(results.insertedId)
        {
            res.status(201).json({success: true, message: "Club created successfully", data: newClub});
        }
        else
        {
            res.status(400).json({success: false, message: "Failed to create club", data: null});
        }
        
        
        
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})

app.put("/mongo/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }

        const { nom, country } = req.body;

        const query = {id: id};

        const updateClub = {
            $set: {
                nom: nom,
                country: country
            }
        }
        const results = await dbMongo.collection("clubs").updateOne(query, updateClub);

        if(results.modifiedCount > 0)
        {
            res.status(200).json({success: true, message: "Club updated successfully", data: {id, nom, country}});
        }
        else
        {
            res.status(400).json({success: false, message: "Failed to update club", data: null});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})

app.delete("/mongo/clubs/:id", async(req, res) => {
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
        {
            return res.status(400).json({success: false, message: "Invalid club ID", data: null});
        }

        const query = {id: id};
        const results = await dbMongo.collection("clubs").deleteOne(query);

        if(results.deletedCount > 0)
        {
            res.status(200).json({success: true, message: "Club deleted successfully", data: results});
        }
        else
        {
            res.status(400).json({success: false, message: "Failed to delete club", data: null});
        }
        
        
        
    }catch(err){
       console.log(err);
       res.status(500).json({success: false, message: "Internal Server Error", data: null});
    }
})


app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
})
