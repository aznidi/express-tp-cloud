const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 9000;
const util = require('util');

// app.use(express.json());

app.get("/", (req, res) => {
  res.send("<p>Express API Is working successfully</p>");
});


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SAAZwinners9305@',
  database: 'express_tp_employes'
})


db.connect((err) => {
  if(err) throw err;
  console.log('Connected to database.');
})
const dbQuery = util.promisify(db.query).bind(db);

//get an employe
app.get('/api/employes', (req, res) => {
  try{
    const sql = "SELECT * FROM employes";
    db.query(sql, (error, results) => {
      if(error) throw error;
      res.status(200).json({
        'success': true,
        'message': 'Employes fetched successfully',
        'data': results,
      })
    })
  }catch(err){
    res.status(500).json({
      'success': false,
      'message': 'Employes fetched failed',
      'data': err.message,
    })
  }
})
// get by matricule
app.get('/api/employes/:matricule', (req, res) => {
  try{
    const matricule = parseInt(req.params?.matricule);
    if(!matricule) throw new Error('No matricule provided');

    const sql = "SELECT * FROM employes WHERE matricule = ?";
    db.query(sql, [matricule], (error, results) => {
      if(error) throw error;
      res.status(200).json({
        'success': true,
        'message': 'Employes fetched successfully',
        'data': results,
      })
    })
  }catch(err){
    res.status(500).json({
      'success': false,
      'message': 'Employes fetched failed',
      'data': err.message,
    })
  }
})

// add new employe
app.post('/api/employes', async (req, res) => {
  try{
    const { matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = req.body || {};

    if(!matricule || !nom || !prenom || !fonction || !affectation || !salaire || !age || !rue || !ville || !localite || !postalcode)
    {
        throw new Error('All fields are required');
    }
    const checkSql = "SELECT * FROM employes WHERE matricule = ?";
    const existingEmploye = await dbQuery(checkSql, [matricule]);

    if(existingEmploye && existingEmploye.length > 0)
    {
        throw new Error('Matricule already exists');
    }
    

    const sql = "INSERT INTO employes (matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const newEmploye = await dbQuery(sql, [matricule, nom, prenom,  fonction, affectation, salaire, age, rue, ville, localite, postalcode]);
    if (newEmploye.affectedRows > 0) {
      res.status(201).json({
          'success': true,
          'message': 'Employe added successfully',
          'data': {
            matricule,
            nom,
            prenom,
            fonction,
            affectation,
            salaire,
            age,
            rue,
            ville,
            localite,
            postalcode
          }
      });
    }
  }catch(err){
    res.status(500).json({
      'success': false,
      'message': 'Employes fetched failed',
      'data': err.message,
    })
  }
})

// update an employe 
app.put('/api/employes/:matricule',  async (req, res) => {
  try{
    const matricule = parseInt(req.params?.matricule || '');

    if(!matricule)
    {
        throw new Error('No Matricule Provided');
    }

    const sqlforcheck = "SELECT * FROM employes WHERE matricule = ?";
    const existedEmploye = await dbQuery(sqlforcheck, [matricule]);
    
    if (!existedEmploye || existedEmploye.length === 0) {
        throw new Error('Employee not found');
    }

    
    const data = req.body || {};
    
    const updatedEmploye = {
        ...existedEmploye
    };
    
    if(data.nom) updatedEmploye.nom = data.nom;
    if(data.prenom) updatedEmploye.prenom = data.prenom;
    if(data.fonction) updatedEmploye.fonction = data.fonction;
    if(data.affectation) updatedEmploye.affectation = data.affectation;
    if(data.salaire) updatedEmploye.salaire = data.salaire;
    if(data.age) updatedEmploye.age = data.age;
    
    if(data.adresse) {
        updatedEmploye.adresse = {
            ...existedEmploye.adresse,
            ...data.adresse
        };
    }

    const { nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = employe;
        
        const checkSql = "SELECT * FROM employes WHERE matricule = ?";
        const existingEmploye = await dbQuery(checkSql, [oldMatricule]);
        
        if (!existingEmploye || existingEmploye.length === 0) {
            throw new Error('Employee not found');
        }
        
        const sql = "UPDATE employes SET nom = ?, prenom = ?, fonction = ?, affectation = ?, salaire = ?, age = ?, rue = ?, ville = ?, localite = ?, postalcode = ? WHERE matricule = ?";
        const results = await dbQuery(sql, [nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode, oldMatricule]);
        
        if (results.affectedRows > 0) {
            const updatedEmploye = await dbQuery("SELECT * FROM employes WHERE matricule = ?", [oldMatricule]);
            return updatedEmploye[0];
        }

    res.status(200).json({
        'success': true,
        'message': 'Employe updated successfully',
        'data': updatedEmployeItem,
    });

  }catch(error){
    res.status(500).json({
      'success': false,
      'message': 'Employe updated failed',
      'data': error.message,
  })
  }
})
//delete an empolyes
app.delete('/api/employes/:matricule', async (req, res) => {
  try{
    const matricule = req.params?.matricule || null;
    if(!matricule) throw new Error('No matricule provided !');

    // check if the matricule is exist
    const checkSql = "SELECT * FROM employes WHERE matricule = ?";
    const existingEmploye = await dbQuery(checkSql, [matricule]);
    if (!existingEmploye || existingEmploye.length === 0) {
        throw new Error('Employe not found');
    }

    //delete is id exist

    const sql = "DELETE FROM employes WHERE matricule = ?";
    const results = await dbQuery(sql, [matricule]);

    if(results.affectedRows > 0)
    {
      res.status(200).json({
        'success': true,
        'message': 'Employe deleted successfully',
        'data': matricule,
    });
    }
  }catch(err){
    res.status(500).json({
      'success': false,
      'message': 'Employes delete failed',
      'data': err.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT} `)
})