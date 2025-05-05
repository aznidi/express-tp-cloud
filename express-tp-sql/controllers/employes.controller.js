const { getAllEmployesService, getEmployeByMatriculeService, createEmployeService, updateEmployeService, deleteEmployeService, getEmployesByAgeService, getEmployesBySalaryService } = require('../services/employes.service.js');

//Get All Employes
const getAllEmployes = async (req, res) => {
    try{
        const employes = await getAllEmployesService();
        res.status(200).json({
            'success': true,
            'message': 'Employes fetched successfully',
            'data': employes,
        });
    } catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employes fetched failed',
            'data': error.message,
        })
    }
}

//Get Employe by matricule
const getEmployeByMatricule = async (req, res) => {
    try{
        const matricule = parseInt(req.params?.matricule || '');

        if(!matricule)
        {
            throw new Error('No Matricule Provided');
        }

        const employe = await getEmployeByMatriculeService(matricule);

        if(!employe)
        {
            throw new Error('Employe not found');
        }

        res.status(200).json({
            'success': true,
            'message': 'Employe fetched successfully',
            'data': employe,
        });
    } catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employe fetched failed',
            'data': error.message,
        })
    }
}

// Add new Employes 
const addEmploye = async(req, res) => {
    try{
        const { matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = req.body || {};

        if(!matricule || !nom || !prenom || !fonction || !affectation || !salaire || !age || !rue || !ville || !localite || !postalcode)
        {
            throw new Error('All fields are required');
        }

        const existingEmploye = await getEmployeByMatriculeService(matricule);
        
        if(existingEmploye && existingEmploye.length > 0)
        {
            throw new Error('Matricule already exists');
        }

        const employe = {
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

        const newEmploye = await createEmployeService(employe);

        res.status(201).json({
            'success': true,
            'message': 'Employe added successfully',
            'data': newEmploye,
        });
    } catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employe added failed',
            'data': error.message,
        })
    }
}


//Update an employe 
const updateEmploye = async (req, res) => {
    try{
        const matricule = parseInt(req.params?.matricule || '');

        if(!matricule)
        {
            throw new Error('No Matricule Provided');
        }

        const employe = await getEmployeByMatriculeService(matricule);

        if(!employe)
        {
            throw new Error('Employe not found');
        }
        
        const data = req.body || {};
        
        const updatedEmploye = {
            ...employe
        };
        
        if(data.nom) updatedEmploye.nom = data.nom;
        if(data.prenom) updatedEmploye.prenom = data.prenom;
        if(data.fonction) updatedEmploye.fonction = data.fonction;
        if(data.affectation) updatedEmploye.affectation = data.affectation;
        if(data.salaire) updatedEmploye.salaire = data.salaire;
        if(data.age) updatedEmploye.age = data.age;
        
        if(data.adresse) {
            updatedEmploye.adresse = {
                ...employe.adresse,
                ...data.adresse
            };
        }

        const updatedEmployeItem = await updateEmployeService(matricule, updatedEmploye);

        res.status(200).json({
            'success': true,
            'message': 'Employe updated successfully',
            'data': updatedEmployeItem,
        });

    } catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employe updated failed',
            'data': error.message,
        })
    }
}


//Delete an employe
const deleteEmploye = async (req, res) => {
    try{
        const matricule = parseInt(req.params?.matricule || '');

        if(!matricule)
        {
            throw new Error('No Matricule Provided');
        }

        const employe = await deleteEmployeService(matricule);

        if(!employe)
        {
            throw new Error('Employe not found');
        }

        res.status(200).json({
            'success': true,
            'message': 'Employe deleted successfully',
            'data': employe,
        });
    } catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employe deletion failed',
            'data': error.message,
        })
    }
}

//Get Employes by filter
const getEmployesByFilter = async (req, res) => {
    try{
        const { age } = req.params || {};

        if(!age)
        {
            throw new Error('No age provided');
        }

        const employes = await getEmployesByAgeService(age);

        res.status(200).json({
            'success': true,
            'message': 'Employes by filter fetched successfully',
            'data': employes,
        });
        
    }catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employes by filter failed',
            'data': error.message,
        })
    }
}


//Get Employes by salary between
const getEmployesBySalary = async (req, res) => {
    try{
        const { min, max } = req.params || {};

        if(!min || !max)
        {
            throw new Error('No min or max salary provided');
        }

        const employes = await getEmployesBySalaryService(min, max);

        res.status(200).json({
            'success': true,
            'message': 'Employes by salary fetched successfully',
            'data': employes,
        });
        
    }catch(error){
        res.status(500).json({
            'success': false,
            'message': 'Employes by salary failed',
            'data': error.message,
        })
    }
}




module.exports = {
    getAllEmployes,
    getEmployeByMatricule,
    addEmploye,
    updateEmploye,
    deleteEmploye,
    getEmployesByFilter,
    getEmployesBySalary
}
