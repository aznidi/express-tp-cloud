const express = require("express");
const app = express();
const mysql = require("mysql2");
const { MongoClient } = require("mongodb");

const connectionString = "mongodb://localhost:27017";

const client = new MongoClient(connectionString);

const dbName = "clubs";


async function run(){
	try{
		client.connect((err) => {
			if(err) throw err;
			
			console.log("Connected to mongo successfully");
		});
		
	}catch(err){
		console.log('Error while connecting to database mongo', err.message);
		client.close();
		return;
		
	}
}
run();

const dbMongo = client.db(dbName);




const PORT = 8000;
const pool = mysql.createPool({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "SAAZwinners9305@",
	database: 'clubs'
});
	
const db = pool.promise();

app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Server is UP!' });
})

app.get('/api/teams', async (req, res) => {
	try{
		const [results] = await db.query('SELECT * FROM clubs');
		res.status(200).json({ 
			sucess: true,
			message: 'Data fetched successfully',
			data: results
		});
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err });
	}
})

app.get('/api/mongo/teams', async (req, res) => {
	try{
		const clubs = await dbMongo.collection("clubs").find({}).toArray();
		res.status(200).json({ 
			sucess: true,
			message: 'Data fetched successfully',
			data: clubs
		});
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err });
	}
})


app.get('/api/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		
		const [results] = await db.query('SELECT * FROM clubs WHERE id = ?', [id]);
		res.status(200).json({ 
			sucess: true,
			message: 'Data fetched successfully',
			data: results
		});
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err });
	}
})

app.get('/api/mongo/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		const query = {id: parseInt(id)};
		const results = await dbMongo.collection('clubs').find(query).toArray();
		if(results)
		{
			res.status(200).json({ 
				sucess: true,
				message: 'Data fetched successfully',
				data: results
			});
		}else{
				
			res.status(404).json({ 
				sucess: true,
				message: 'Item not found',
				data: null
			});
		}
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err.message });
	}
})

app.post('/api/teams/', async (req, res) => {
	try{
		const { nom, country } = req.body;
		
		if(!nom || !country){
			res.status(400).json({ message: 'ALL fields are required' });
		}
		
		const sql = 'INSERT INTO clubs(nom, country) VALUE ( ?, ?)';
		const [results] = await db.query(sql, [nom, country]);
		
		if(results.affectedRows > 0)
		{
			res.status(200).json({ 
				sucess: true,
				message: 'Data fetched successfully',
				data: {
					id: results.insertId,
					nom,
					country
				}
			});
		}else{
			throw new Error('Failed to create new Club');
		}
		
		
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err });
	}
})

app.post('/api/mongo/teams/', async (req, res) => {
	try{
		const { nom, country } = req.body;
		
		if(!nom || !country){
			res.status(400).json({ message: 'ALL fields are required' });
		}
		
		const newClub = {
			id: Date.now(),
			nom,
			country
		}
		
		const results = await dbMongo.collection("clubs").insertOne(newClub);
		if(results.acknowledged)
		{
			res.status(201).json({ 
				sucess: true,
				message: 'Data created successfully',
				data: newClub
			});
		}else{
			throw new Error('Failed to create item');
		}
		
		
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err.message });
	}
})



app.put('/api/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		if(isNaN(id)){
			res.status(400).json({ message: 'ID is integer' });
		}
		const { nom, country } = req.body;
		
		
		const sql = 'UPDATE clubs SET nom = ?, country = ? WHERE id = ?';
		const [results] = await db.query(sql, [nom, country, id]);
		
		res.status(200).json({ 
				sucess: true,
				message: 'Data updated successfully',
				data: {
					id: id,
					nom,
					country
				},
				updatedItems: results.changedRows
			});
		
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err });
	}
})


app.put('/api/mongo/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		if(isNaN(id)){
			res.status(400).json({ message: 'ID is integer' });
		}
		const { nom, country } = req.body;
		
		
		const existedItem = dbMongo.collection("clubs").find({id: parseInt(id)}).toArray();
		
		if(!existedItem){
			res.status(404).json({ message: 'Item not found' });
		}
		
		
		const results = await dbMongo.collection("clubs").updateOne({id: parseInt(id)}, {$set: {nom, country}});
		
		res.status(200).json({ 
				sucess: true,
				message: 'Data updated successfully',
				data: {
					id: id,
					nom,
					country
				},
				updatedItems: results
			});
		
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err.message });
	}
})



app.delete('/api/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		if(isNaN(id)){
			res.status(400).json({ message: 'ID is integer' });
		}
		
		
		const sql = 'DELETE FROM clubs WHERE id = ?';
		const [results] = await db.query(sql, [id]);
		
		res.status(200).json({ 
				sucess: true,
				message: 'Data deleted successfully',
				deletedItems: results.affectedRows
			});
		
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err.message });
	}
})

app.delete('/api/mongo/teams/:id', async (req, res) => {
	try{
		const id = req.params.id;
		if(isNaN(id)){
			res.status(400).json({ message: 'ID is integer' });
		}
		
		
		const results = await dbMongo.collection("clubs").deleteOne({id: parseInt(id)});
		
		if(results){
				
			res.status(200).json({ 
					sucess: true,
					message: 'Data deleted successfully',
					deletedItems: results
				});
		}
	}catch(err){
		console.log(err);
		res.status(500).json({ message: err.message });
	}
})



app.listen(PORT, () => {
	console.log(`Server is running successfully on port ${PORT}.`);
})



