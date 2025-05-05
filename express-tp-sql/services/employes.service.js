const db = require("../database/connect.js");
const util = require('util');

/*
 * Promisify la méthode query de la connexion à la base de données.
 * Cela transforme la méthode query qui utilise des callbacks en une fonction
 * qui retourne une Promise, ce qui permet d'utiliser async/await pour
 * des requêtes SQL plus lisibles et plus faciles à gérer.
 * Sans promisify, nous devrions utiliser des callbacks imbriqués,
 * ce qui rendrait le code plus difficile à maintenir.
 */
const dbQuery = util.promisify(db.query).bind(db);

//Get All Employes
const getAllEmployesService = async () => {
    try {
        const sql = "SELECT * FROM employes";
        const results = await dbQuery(sql);
        return results;
    } catch (error) {
        console.error("Error fetching employes:", error);
        throw error;
    }
}

//Get Employe by matricule
const getEmployeByMatriculeService = async (matricule) => {
    try {
        const sql = "SELECT * FROM employes WHERE matricule = ?";
        const results = await dbQuery(sql, [matricule]);
        return results;
    } catch (error) {
        console.error("Error fetching employe by matricule:", error);
        throw error;
    }
}

//Create New Employe
const createEmployeService = async (employe) => {
    try{ 
        const { matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = employe;
        
        const checkSql = "SELECT * FROM employes WHERE matricule = ?";
        const existingEmploye = await dbQuery(checkSql, [matricule]);
        
        if (existingEmploye && existingEmploye.length > 0) {
            throw new Error('Matricule already exists');
        }
        
        const sql = "INSERT INTO employes (matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const results = await dbQuery(sql, [matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode]);
        
        if (results.affectedRows > 0) {
            const newEmploye = await dbQuery("SELECT * FROM employes WHERE matricule = ?", [matricule]);
            return newEmploye[0];
        }
        return results;
    } catch(error) {
        console.error("Error creating employe:", error);
        throw error;
    }
}


// update Employe
const updateEmployeService = async (oldMatricule, employe) => {
    try {
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
        return results;
    } catch (error) {
        console.error('Error updating employe:', error);
        throw error;
    }
}

// Delete Employe
const deleteEmployeService = async (matricule) => {
    try {
        const checkSql = "SELECT * FROM employes WHERE matricule = ?";
        const existingEmploye = await dbQuery(checkSql, [matricule]);
        if (!existingEmploye || existingEmploye.length === 0) {
            throw new Error('Employe not found');
        }
        const sql = "DELETE FROM employes WHERE matricule = ?";
        const results = await dbQuery(sql, [matricule]);
        return results;
    } catch (error) {
        console.error('Error deleting employe:', error);
        throw error;
    }
}

//Get Employes by filter
const getEmployesByAgeService = async (age) => {
    try {
        const sql = "SELECT * FROM employes WHERE age = ?";
        const results = await dbQuery(sql, [age]);
        return results;
    } catch (error) {
        console.error('Error fetching employes by filter:', error);
        throw error;
    }
}

//Get Employes by salary between
const getEmployesBySalaryService = async (min, max) => {
    try {
        const sql = "SELECT * FROM employes WHERE salaire BETWEEN ? AND ?";
        const results = await dbQuery(sql, [min, max]);
        return results;
    } catch (error) {
        console.error('Error fetching employes by salary:', error);
        throw error;
    }
}

module.exports = {
    getAllEmployesService,
    getEmployeByMatriculeService,
    createEmployeService,
    updateEmployeService,
    deleteEmployeService,
    getEmployesByAgeService,
    getEmployesBySalaryService
};