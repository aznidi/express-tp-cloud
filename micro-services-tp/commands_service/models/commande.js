const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
    products: {
        type: [String],
    },
    email: {
        type: String,
    },
    total_price: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;

