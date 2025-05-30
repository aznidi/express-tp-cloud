const mongoose = require('mongoose');

const chansonSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  artiste: {
    type: String,
    required: true
  },
  duree: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chanson', chansonSchema);
