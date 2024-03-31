const { Schema, default: mongoose } = require('mongoose');

const projectSchema = Schema({
  owner: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  contributors: {
    type: [Schema.Types.ObjectId],
    ref: 'userModel',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('projetModel', projectSchema);
