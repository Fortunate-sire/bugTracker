// routes.js - Routes configuration
const express = require('express');
const { isAuthenticated } = require('../middlewares/authorization');
const {
  tickets, searchTicketProjectContributors, addTicket, deleteTicket, getTicketById,
  editTicket, getSingleTicket, ticketMessage, deleteMessage,
} = require('../controllers/ticketsControllers');

const router = express.Router();

router.get('/tickets/:projectId', isAuthenticated, tickets);
router.post('/searchTicketProjectContributors/:projectId', searchTicketProjectContributors);
router.post('/addTicket/:projectId', isAuthenticated, addTicket);
router.get('/tickets/delete/:ticketId', isAuthenticated, deleteTicket);
router.get('/getTicket/:ticketId', getTicketById);
router.post('/editTicket/:ticketId', isAuthenticated, editTicket);
router.get('/singleTicket/:ticketId', isAuthenticated, getSingleTicket);
router.post('/ticketMessage/:ticketId', isAuthenticated, ticketMessage);
router.get('/deleteMessage/:messageId', isAuthenticated, deleteMessage);

module.exports = router;
