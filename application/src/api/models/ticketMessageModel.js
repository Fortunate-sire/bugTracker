const { Schema, model } = require('mongoose');

const ticketMessageSchema = Schema({
  ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  user: { type: Schema.Types.ObjectId, ref: 'userModel' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('ticketMessageModel', ticketMessageSchema);
