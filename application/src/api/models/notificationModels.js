const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = Schema({
  userId: {
    type: String,
  },

  notification: {
    type: String,
  },

  read: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('notificationModel', notificationSchema);
