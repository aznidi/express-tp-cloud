const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  idUtilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  listeChansons: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
