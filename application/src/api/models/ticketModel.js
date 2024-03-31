const { Schema, model } = require('mongoose');

const ticketSchema = Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'ProjectModel', // Reference to the Project model
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
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

  type: {
    type: String,
    default: 'bug',
  },

  priority: {
    type: String,
    default: 'regular',
  },

  status: {
    type: String,
    default: 'open',
  },

  assinged: {
    type: [Schema.Types.ObjectId],
    ref: 'userModel',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Ticket', ticketSchema);
