const { Schema, model } = require('mongoose');

const ticketAssignmentSchema = Schema({
  project: { type: Schema.Types.ObjectId, ref: 'projectModel' },
  ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  users: { type: [Schema.Types.ObjectId], ref: 'userModel' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('ticketAssingmentModel', ticketAssignmentSchema);
