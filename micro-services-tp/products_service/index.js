const express = require('express');
const mongoose = require("mongoose");
const Product = require("./models/produit.js");
const app = express();

const PORT = process.env.PORT || 8002;  

app.use(express.json());


mongoose.set('strictQuery', false);
async function connectToMongoDB()
{
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products_service'
        );
        console.log('Connected to Products Service Database');
    }catch(error){
        console.error('Error connecting to Products Service Database:', error);
        process.exit(1);
    }
}

connectToMongoDB();


app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Product micro service is running successfully',
        data: null
    });
});

app.get('/products', async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            status:  true,
            message: 'Products fetched successfully',
            data: products
        });
    }catch(error){
        res.status(500).json({
            status: false,
            message: 'Error fetching products',
            data: null
        });
    }
});


app.post('/products', async(req, res) => {
    try{
        const {name, description, price} = req.body;
        const product = new Product({name, description, price});

        await product.save();

        if(!product){
            return res.status(400).json({
                status: false,
                message: 'Product not created',
                data: null
            });
        }

        res.status(201).json({
            status: true,
            message: 'Product created successfully',
            data: product
        });
        
    }catch(error){
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: null
        });
    }
})

app.post('/buy/', async (req, res) => {
    try{
        const { products_ids } = req.body || [];

        const products = await Product.find({_id: {$in: products_ids}});

        if(products.length === 0){
            return res.status(404).json({
                status: false,
                message: 'Products not found',
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: 'Products bought successfully',
            data: products
        });
        
    }catch(error){
        res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: null
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




