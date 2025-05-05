const bycrypt = require("bcryptjs");
const connectToDatabase = require("../db/conn.js");
const jwt = require("jsonwebtoken");
const e = require("express");

const register = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { nom, prenom, email, password } = req.body;

        if(!nom || !prenom || !email || !password)
        {
            return res.status(400).json({
                message: "All fields are required",
                data: null
            });
        }

        const user = await findUserByEmail(email);
        if(user) {
            return res.status(409).json({
                message: "User already exists",
                data: null
            });
        }

        const newUser = {
            nom: nom,
            prenom: prenom,
            email: email,
            password: bycrypt.hashSync(password, 10),
        }

        const results = await db.collection("users").insertOne(newUser);

        if(results.acknowledged) {  
            return res.status(201).json({
                message: "User created successfully",
                data: await findUserByEmail(email),
            });
        }


    }catch(error)
    {
        console.log('Une erreur est survenue lors de l\'inscription : ', error);
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
}

const login = async (req, res) => {
    try{
        const db = await connectToDatabase();
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                data: null
            });
        }

        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                data: null
            });
        }

        const isPasswordValid = bycrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                data: null
            });
        }

        const token = jwt.sign({ email: user.email }, 'winners', { expiresIn: "1h" });
        
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);
        return res.status(200).json({
            message: "Login successful",
            data: {
                nom: user.nom,
                prenom: user.prenom,
                email: user.email
            },
            token: token,
            jwtInfo: {
                expiresIn: "1h",
                expiresAt: expiresAt.toISOString(), 
                issuedAt: new Date(decoded.iat * 1000).toISOString(),
                algorithm: "HS256", 
                type: "Bearer"
            }

        });

    }catch(error){
        console.log('Une erreur est survenue lors de la connexion : ', error);
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
}


async function findUserByEmail(email) {
    try{
        const db = await connectToDatabase();
        let query = {email: email};
        const user = await db.collection("users").findOne(query);

        if(!user) {
            return null;
        }

        return user;
    }catch(error){
        console.error('Failed to fetch employe:', error);
    }
}


module.exports = {
    register,
    findUserByEmail,
    login
};