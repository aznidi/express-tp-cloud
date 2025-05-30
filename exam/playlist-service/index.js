const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Playlist = require('./models/playlist');

const app = express();
const PORT = 8002;
const MONGODB_URI = 'mongodb://localhost:27017/music_app_playlists';

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
.then(() => console.log('Connected to MongoDB - Playlist Service'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

app.post('/playlist', async (req, res) => {
  try {
    const { nom, idUtilisateur } = req.body;
    
    const newPlaylist = new Playlist({ 
      nom, 
      idUtilisateur,
      listeChansons: []
    });
    await newPlaylist.save();
    
    res.status(200).json({ 
      message: 'Playlist créée avec succès',
      playlist: newPlaylist
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.get('/playlist/:email', async (req, res) => {
  try {
    const playlists = await Playlist.find();
    
    if (playlists.length === 0) {
      return res.status(404).json({ message: 'Aucune playlist trouvée' });
    }
    
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
app.put('/playlist/ajouter-chanson/:playlistId', async (req, res) => {
  try {
    const { chansonId } = req.body;
    const playlistId = req.params.playlistId;
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }
    
    if (playlist.listeChansons.includes(chansonId)) {
      return res.status(400).json({ message: 'La chanson est déjà dans la playlist' });
    }
    
    playlist.listeChansons.push(chansonId);
    await playlist.save();
    
    res.status(200).json({ 
      message: 'Chanson ajoutée à la playlist avec succès',
      playlist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.put('/playlist/retirer-chanson/:playlistId', async (req, res) => {
  try {
    const { chansonId } = req.body;
    const playlistId = req.params.playlistId;
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }
    
    // Retirer la chanson de la liste
    playlist.listeChansons = playlist.listeChansons.filter(
      id => id.toString() !== chansonId
    );
    await playlist.save();
    
    res.status(200).json({ 
      message: 'Chanson retirée de la playlist avec succès',
      playlist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.put('/playlist/renommer/:playlistId', async (req, res) => {
  try {
    const { nouveauNom } = req.body;
    const playlistId = req.params.playlistId;
    
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { nom: nouveauNom },
      { new: true }
    );
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }
    
    res.status(200).json({ 
      message: 'Playlist renommée avec succès',
      playlist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.delete('/playlist/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }
    
    res.status(200).json({ message: 'Playlist supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Playlist Service running on port ${PORT}`);
});
