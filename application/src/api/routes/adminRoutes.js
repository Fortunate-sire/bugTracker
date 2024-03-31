// routes.js - Routes configuration
const express = require('express');
const { isAdmin } = require('../middlewares/authorization');
const {
  admin, addUser, edithUser, getUserById, deleteUser, edithPosition, deletePosition,
  deleteMultipleUsers, searchUser,
} = require('../controllers/adminControllers');

const router = express.Router();

router.get('/admin', isAdmin, admin);
router.post('/addUser', isAdmin, addUser);
router.get('/edit/:userId', isAdmin, getUserById);
router.post('/edit/:userId', isAdmin, edithUser);
router.post('/searchUser', isAdmin, searchUser);
router.post('/deleteMultipleUsers', isAdmin, deleteMultipleUsers);
router.get('/delete/:userId', isAdmin, deleteUser);
router.post('/edithPosition', isAdmin, edithPosition);
router.get('/deletePosition/:positionId', isAdmin, deletePosition);

module.exports = router;
