// routes.js - Routes configuration
const express = require('express');

const router = express.Router();
const { home, notification } = require('../controllers/dashboard');
const { addPosition } = require('../controllers/adminControllers');
const { isAuthenticated, isAdmin } = require('../middlewares/authorization');

router.get('/home', isAuthenticated, home);
router.post('/addPosition', isAdmin, addPosition);
router.get('/notification', isAuthenticated, notification);

module.exports = router;
