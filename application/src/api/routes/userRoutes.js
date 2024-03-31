// routes.js - Routes configuration
const express = require('express');

const router = express.Router();
const { signUp, login, logout, getAllUSers, loginDemoAdmin, loginDemoUser } = require('../controllers/userAuthControllers');
const { userSignUpErrors } = require('../middlewares/userErrorHandler');
const { isAuthenticated } = require('../middlewares/authorization');

router.get('/signup', signUp);
router.post('/signup', userSignUpErrors, signUp);
router.get('/', login);
router.post('/', login);
router.get('/logout', isAuthenticated, logout);
router.get('/allUsers', getAllUSers);
router.get('/loginAdmin', loginDemoAdmin);
router.get('/loginUser', loginDemoUser);

module.exports = router;
