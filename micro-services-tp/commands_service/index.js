const express = require('express');
const mongoose = require('mongoose');
const Commande = require('./models/commande');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8001;
mongoose.set('strictQuery', false);
async function connectToMongoDB()
{
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/commandes_service'
        );
        console.log('Connected to Commands Service Database');
    }catch(error){
        console.error('Error connecting to Commands Service Database:', error);
        process.exit(1);
    }
}

connectToMongoDB();

app.use(express.json());

const calculateTotalPrice = (products = []) => {
    let total = 0;
    for(let i = 0; i < products.length; i++){
        total += products[i].price;
    }
    return parseFloat(total.toFixed(2));

}

const getProductsPriceTotal = async (products_ids = []) => {
    try{
        const response = await axios.post("http://localhost:8002/buy", {
                products_ids: products_ids
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response;
    }catch(error){
        return error.message;
    }
}

app.post('/create/commande', async (req, res) => {
    try{
        const { products_ids } = req.body;
        const full_token = req.header('Authorization');
        if(!full_token){
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                data: null
            });
        }
        const token = full_token.split(' ')[1];
        const verified = await verifyToken(token);

        if(!verified?.verified){
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                data: null
            });
        }

        const email = verified?.email || null;
        const userId = verified?.userId || null;

        if(!userId || !email){
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                data: verified
            });
        }
        
       
        if(!Array.isArray(products_ids) || products_ids.length === 0){
            return res.status(400).json({
                status: false,
                message: 'Products ids is required',
                data: null,
            });
        }

        if(!email){
            return res.status(400).json({
                status: false,
                message: 'Email is required',
                data: null,
            });
        }
        
        
        const total_price = await getProductsPriceTotal(products_ids);
        if(!total_price){
            return res.status(400).json({
                status: false,
                message: 'Error fetching products price total',
                data: total_price,
            });
        }

    
        const commande = new Commande({
            products: products_ids,
            email: email,
            total_price: calculateTotalPrice(total_price.data.data),
        });

        await commande.save();

        if(commande){
            return res.status(200).json({
                status: true,
                message: 'Commande created successfully',
                data: commande,
            });
        }

        return res.status(400).json({
            status: false,
            message: 'Error creating commande',
            data: null,
        });
        
    }catch(error){
        console.error('Error creating commande:', error);
        res.status(500).json({
            status: false,
            message: 'Error creating commande',
            data: error.message,
        });
    }
})

app.get('/get-commandes-list', async (req, res) => {
    try{
        const commandes = await Commande.find();
        return res.status(200).json({
            status: true,
            message: 'Commandes fetched successfully',
            data: commandes,
        });
    }catch(error){
        console.error('Error fetching commandes:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching commandes',
        });
    }
})


const verifyToken = async (token) => {
    try{
        const response = await axios.get('http://localhost:8003/auth/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data?.data || {};
    }catch(error){
        throw new Error('Invalid token');
    }
}

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Commande micro service is running successfully',
        data: null
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




