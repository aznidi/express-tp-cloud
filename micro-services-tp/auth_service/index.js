const express = require("express");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 8003;
const JWT_SECRET = process.env.JWT_SECRET || "salah_secret";
const app = express();


app.use(express.json());
mongoose.set('strictQuery', false);
async function connectToMongoDB()
{
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_service'
        );
        console.log('Connected to Auth Service Database');
    }catch(error){
        console.error('Error connecting to Auth Service Database:', error);
        process.exit(1);
    }
}

connectToMongoDB();

app.get("/", (req, res) => {
    res.status(200).json({
       success: true,
       message: `Auth service is running successfully on port ${PORT}`,
       data: null
    });
});


app.post("/auth/register", async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null
            });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null
            });
        }

        const data = {
            name,
            email,
            password: bcrypt.hashSync(password, 10)
        }
        const newUser = new User(data);    
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "User creation failed",
            data: error.message
        });
    }
});


app.post("/auth/login", async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null
            });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }


        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }

        const token = jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token, user }
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: "Login failed",
            data: error.message
        });
    }
});


const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    
    if(!token){
        return res.status(401).json({
            success: false, message: "Unauthorized" });
    }

    const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);

    if(!verified){
        return res.status(401).json({
            success: false, message: "Unauthorized" });
    }   

    req.user = verified;
    next();
}

app.get("/auth/protected", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected route accessed successfully",
        data: req.user
    });
});


app.get("/auth/verify-token", (req, res) => {
    try{

        const token = req.header('Authorization');
        if(!token){
            return res.status(401).json({
                success: false, 
                message: "token in header is required",
                data: null
            });
        }

        const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
        if(!verified){
            return res.status(401).json({
                success: false, 
                message: "Invalid token",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Token verified successfully",
            data: {
                userId: verified.userId,
                email: verified.email,
                verified: true
            },
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error.message
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
