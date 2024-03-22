// routes.js - Routes configuration
const express = require('express');

const router = express.Router();
const { home } = require('../controllers/dashboard');

router.get('/home', home);

module.exports = router;
