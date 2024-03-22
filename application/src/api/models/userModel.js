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
    type: String,
    default: 'developer',
  },

  role: {
    type: String,
    default: 'user',
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('userModel', userSchema);
