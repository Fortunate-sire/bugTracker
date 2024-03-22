// routes.js - Routes configuration
const express = require('express');
const { adminAuth } = require('../middlewares/authorization');
const {
  admin, addUser, edithUser, getUserById, deleteUser,
} = require('../controllers/adminControllers');

const router = express.Router();

router.get('/admin', adminAuth, admin);
router.post('/addUser', adminAuth, addUser);
router.get('/edith/:userId', getUserById);
router.post('/edith/:userId', adminAuth, edithUser);
router.get('/delete/:userId', deleteUser);

module.exports = router;
