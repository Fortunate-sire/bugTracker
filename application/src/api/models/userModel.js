const mongoose = require('mongoose');
const { isEmail } = require('validator');

const { Schema } = mongoose;
const userSchema = Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validator: [isEmail, 'please enter a valid email'],
  },

  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'positionModel',
  },

  role: {
    type: String,
    default: 'user',
  },

  password: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('userModel', userSchema);
