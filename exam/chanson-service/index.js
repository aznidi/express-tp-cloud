const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Chanson = require('./models/chanson');

const app = express();
const PORT = 8001;
const MONGODB_URI = 'mongodb://localhost:27017/music_app_chansons';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB - Chanson Service'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET /chansons - Lister toutes les chansons disponibles
app.get('/chansons', async (req, res) => {
  try {
    const chansons = await Chanson.find();
    res.status(200).json(chansons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /chansons/filtrer?genre=... - Filtrer les chansons par genre musical
app.get('/chansons/filtrer', async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      return res.status(400).json({ message: 'Paramètre genre requis' });
    }
    
    const chansons = await Chanson.find({ 
      genre: { $regex: genre, $options: 'i' } 
    });
    
    if (chansons.length === 0) {
      return res.status(404).json({ message: 'Aucune chanson trouvée pour ce genre' });
    }
    
    res.status(200).json(chansons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /chanson/recherche?motcle=... - Rechercher une chanson par titre ou artiste
app.get('/chanson/recherche', async (req, res) => {
  try {
    const { motcle } = req.query;
    if (!motcle) {
      return res.status(400).json({ message: 'Paramètre motcle requis' });
    }
    
    const chansons = await Chanson.find({
      $or: [
        { titre: { $regex: motcle, $options: 'i' } },
        { artiste: { $regex: motcle, $options: 'i' } }
      ]
    });
    
    res.status(200).json(chansons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /chanson/:id - Récupérer une chanson par ID
app.get('/chanson/:id', async (req, res) => {
  try {
    const chanson = await Chanson.findById(req.params.id);
    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    res.status(200).json(chanson);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /chanson - Créer une nouvelle chanson
app.post('/chanson', async (req, res) => {
  try {
    const { titre, artiste, duree, genre } = req.body;
    
    // Validation basique
    if (!titre || !artiste || !duree || !genre) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis (titre, artiste, duree, genre)' 
      });
    }
    
    const newChanson = new Chanson({ titre, artiste, duree, genre });
    await newChanson.save();
    
    res.status(201).json({ 
      message: 'Chanson ajoutée avec succès',
      chanson: newChanson
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /chanson/:id - Modifier une chanson
app.put('/chanson/:id', async (req, res) => {
  try {
    const { titre, artiste, duree, genre } = req.body;
    const chanson = await Chanson.findByIdAndUpdate(
      req.params.id,
      { titre, artiste, duree, genre },
      { new: true }
    );
    
    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    
    res.status(200).json({ 
      message: 'Chanson modifiée avec succès',
      chanson 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /chanson/:id - Supprimer une chanson
app.delete('/chanson/:id', async (req, res) => {
  try {
    const chanson = await Chanson.findByIdAndDelete(req.params.id);
    if (!chanson) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    
    res.status(200).json({ message: 'Chanson supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Chanson Service running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /chansons                    - Lister toutes les chansons');
  console.log('  GET    /chansons/filtrer?genre=...   - Filtrer par genre');
  console.log('  GET    /chanson/recherche?motcle=... - Rechercher par titre/artiste');
  console.log('  GET    /chanson/:id                 - Récupérer une chanson');
  console.log('  POST   /chanson                     - Créer une chanson');
  console.log('  PUT    /chanson/:id                 - Modifier une chanson');
  console.log('  DELETE /chanson/:id                 - Supprimer une chanson');
});
