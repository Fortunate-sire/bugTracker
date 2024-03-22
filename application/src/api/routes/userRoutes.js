// routes.js - Routes configuration
const express = require('express');

const router = express.Router();
const { signUp, login, logout } = require('../controllers/userAuthControllers');
const { userSignUpErrors } = require('../middlewares/userErrorHandler');

router.get('/signup', signUp);
router.post('/signup', userSignUpErrors, signUp);
router.get('/', login);
router.post('/', login);
router.get('/logout', logout);

module.exports = router;
