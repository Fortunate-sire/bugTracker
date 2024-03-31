const mongoose = require('mongoose');

const { Schema } = mongoose;

const positionSchema = Schema({
  position: {
    type: String,
    default: 'developer',
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('positionModel', positionSchema);
