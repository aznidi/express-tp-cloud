const express = require("express");
const connectToDatabase = require("./db/conn.js");
const e = require("express");
const { verifyJWTToken } = require("./middlewares/auth.middleware.js");



const app = express();
const PORT = 9000;

app.use(express.json());


//Auth Routes 
app.use("/api/auth", require("./routes/auth.service.js"));




// test a endpoint
app.get("/",(req, res) => {
    res.status(200).json({
        message: "Server is UP !!",
    });
});

// Employes endpoitns
app.get("/api/employes", verifyJWTToken,  async (req, res) => {
    try{
        const db = await connectToDatabase();
        const employes = await db.collection("employes").find({}).toArray();

        if(employes.length === 0) {
            return res.status(404).json({
                message: "No employes found",
            });
        }

        res.status(200).json({
            message: "Employes fetched successfully",
            data: employes,
            authenticated: true,
            email: req.user.email,
        });
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
});


// fetch employes by matricule
app.get("/api/employes/:matricule", async (req, res) => {
    try{
        const { matricule } = req.params;
        if(!matricule || isNaN(matricule))
        {
            throw new Error("Invalid matricule provided");
        }


        const db = await connectToDatabase();
        let query = {Matricule: parseInt(matricule)};
        const employe = await db.collection("employes").findOne(query);

        if(!employe) {
            return res.status(404).json({
                message: "No employe found with matricule: " + matricule,
                data: null
            });
        }

        res.status(200).json({
            message: "Employe fetched successfully",
            data: employe,
            
        });
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
});


// add a new employe
app.post("/api/employes/", async (req, res) => {
    try{
        const { matricule, nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = req.body;

        if (
            !matricule || isNaN(matricule) ||
            !nom || !prenom || !fonction ||
            !affectation || !salaire || !age || !rue ||
            !ville || !localite || !postalcode
        ) {
            throw new Error(`No data provided ${matricule} ${nom} ${prenom} ${fonction} ${affectation} ${salaire} ${age} ${rue} ${ville} ${localite} ${postalcode}`);
        }
        const Existedemploye = await findEmployeByMatricule(matricule);

        if (Existedemploye) {
            return res.status(409).json({
                message: "Employe already exists",
                data: null
            });
        }

        let newEmploye = {
            Matricule: parseInt(matricule),
            Nom: nom,
            prenom: prenom,
            fonction: fonction,
            affectation: affectation,
            salaire: parseFloat(salaire),
            age: parseInt(age),
            adresse: {
                rue: rue,
                ville: ville,
                localite: localite,
                postalCode: postalcode
            }
        };


        const db = await connectToDatabase();
        const results = await db.collection("employes").insertOne(newEmploye);

        if(results.acknowledged)
        {
            return res.status(201).json({
                message: "Employe added successfully",
                data: newEmploye,
            });
        }
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
});

// update employe by matricule
app.put("/api/employes/:matricule", async (req, res) => {
    try{
        const { matricule } = req.params;
        if(!matricule || isNaN(matricule))
        {
            throw new Error("Invalid matricule provided");
        }


        const employe = await findEmployeByMatricule(matricule);
        if(!employe) {
            return res.status(404).json({
                message: "No employe found with matricule: " + matricule,
                data: null
            });
        }

        const { nom, prenom, fonction, affectation, salaire, age, rue, ville, localite, postalcode } = req.body;
        let newEmploye = {
            ...employe
        };
        if (nom) newEmploye.Nom = nom;
        if (prenom) newEmploye.prenom = prenom;
        if (fonction) newEmploye.fonction = fonction;
        if (affectation) newEmploye.affectation = affectation;
        if (salaire) newEmploye.salaire = parseFloat(salaire);
        if (age) newEmploye.age = parseInt(age);
        if (rue) newEmploye.adresse.rue = rue;
        if (ville) newEmploye.adresse.ville = ville;
        if (localite) newEmploye.adresse.localite = localite;
        if (postalcode) newEmploye.adresse.postalCode = postalcode;

        const db = await connectToDatabase();
        const query = {Matricule: parseInt(matricule)};
        const update = {
            $set: newEmploye
        }
        const results = await db.collection("employes").updateOne(query, update);
   
        if(results.modifiedCount > 0)
        {
            res.status(200).json({
                message: "Employes updated successfully",
                data: newEmploye,
                count: results.modifiedCount
            });
        }

        res.status(200).json({
            message: "Employes updated successfully",
            data: newEmploye,
            count: results.modifiedCount,
            matchedcount: results.matchedCount
        });
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
});

// delete employe by matricule
app.delete("/api/employes/:matricule", async (req, res) => {
    try{
        const { matricule } = req.params;
        if(!matricule || isNaN(matricule))
        {
            throw new Error("Invalid matricule provided");
        }


        const employe = await findEmployeByMatricule(matricule);
        if(!employe) {
            return res.status(404).json({
                message: "No employe found with matricule: " + matricule,
                data: null
            });
        }

     
        const db = await connectToDatabase();
        const query = {Matricule: parseInt(matricule)};

        const results = await db.collection("employes").deleteOne(query);
   
        if(results.acknowledged && results.deletedCount > 0)
        {
            res.status(200).json({
                message: "Employes deleted successfully",
                data: employe,
                deletedCount: results.deletedCount
            });
        }
    }catch(error){
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// function to find employe by matricule
async function findEmployeByMatricule(matricule) {
    try{
        const db = await connectToDatabase();
        let query = {Matricule: parseInt(matricule)};
        const employe = await db.collection("employes").findOne(query);

        if(!employe) {
            return null;
        }

        return employe;
    }catch(error){
        console.error('Failed to fetch employe:', error);
    }
}