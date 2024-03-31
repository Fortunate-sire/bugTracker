const userModel = require('../models/userModel');
const projectModel = require('../models/projectModels');
const ticketModel = require('../models/ticketModel');
const ticketAssingmentModel = require('../models/ticketAssingmentModel');
const notificationModel = require('../models/notificationModels');
const ticketMessageModel = require('../models/ticketMessageModel');
/**
 * Get
 * get tickets page
 */

exports.tickets = async (req, res) => {
  const locals = {
    title: 'tickets',
    messages: req.flash('messages'),
  };
  const { projectId } = req.params;
  const user = await userModel.findOne({ _id: req.session.userId });
  const project = await projectModel.findOne({ _id: projectId }).populate('contributors');
  const tickets = await ticketModel.find({ project }).populate('author');

  const assignedTicketsCounts = {};
  /* eslint-disable */
  for (const contributor of project.contributors) {
    const assignedTicketsCount = await ticketAssingmentModel.countDocuments(
      { users: contributor._id, project });
    assignedTicketsCounts[contributor._id] = assignedTicketsCount;
  }
  /* eslint-enable */
  const templateData = {
    ...locals, user, project, tickets, assignedTicketsCounts,
  };
  res.render('pages/dashBoard/tickets', templateData);
};

exports.searchTicketProjectContributors = async (req, res) => {
  const { projectId } = req.params;
  const { payload } = req.body;
  const project = await projectModel.findOne({ _id: projectId }).populate('contributors');
  const contributorIds = project.contributors.map((contributor) => contributor.id);

  const search = await userModel.find({
    $and: [
      { _id: { $in: contributorIds } }, // Match users whose IDs are in the contributorIds array
      {
        $or: [
          { userName: { $regex: new RegExp(`^${payload}.*`, 'i') } },
          { firstName: { $regex: new RegExp(`^${payload}.*`, 'i') } },
        ],
      },
    ],
  }).populate('position').exec();
  res.send({ payload: search });
};

exports.addTicket = async (req, res) => {
  const { projectId } = req.params;
  const {
    title, description, contributors, type, priority, status,
  } = req.body;
  const author = await userModel.findOne({ _id: req.session.userId });
  const users = await userModel.find({ userName: { $in: contributors } });
  try {
    const project = await projectModel.findOne({ _id: projectId });
    const ticket = await ticketModel.create({
      project, author, title, description, assinged: users, type, priority, status,
    });
    await ticketAssingmentModel.create({
      project,
      ticket,
      users,
    });

    for (let i = 0; i < users.length; i += 1) {
      // eslint-disable-next-line
      await notificationModel.create({
        userId: users[i].id,
        notification: `you where assinged to ${ticket.title} ticket `,
      });
    }
    req.flash('messages', { type: 'success', text: 'ticket created successfully' });
    res.redirect(`/tickets/${projectId}`);
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'sorry some error occured' });
  }
};

exports.editTicket = async (req, res) => {
  const {
    title, description, contributors, type, priority, status,
  } = req.body;
  const { ticketId } = req.params;
  const ticket = await ticketModel.findOne({ _id: ticketId });
  const project = await projectModel.findOne({ _id: ticket.project });
  const users = await userModel.find({ userName: { $in: contributors } });
  const data = {
    title, description, type, priority, status, assinged: users,
  };
  try {
    await ticketModel.updateOne({ _id: ticketId }, data);
    await ticketAssingmentModel.updateOne({ ticket: ticketId }, { users });
    req.flash('messages', { type: 'success', text: 'Ticket edited successfully' });
    return res.redirect(`/tickets/${project.id}`);
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'sorry some error occured' });
    return res.redirect(`/tickets/${project.id}`);
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await ticketModel.findOne({ _id: ticketId }).populate('assinged');
    const project = await projectModel.findOne({ _id: ticket.project }).populate('contributors');
    if (!ticket) {
      return res.status(404).json({ error: 'ticket not found' });
    }
    // Return user data as JSON response
    return res.json({ ticket, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getSingleTicket = async (req, res) => {
  const locals = {
    title: 'tickets',
    messages: req.flash('messages'),
  };
  const { ticketId } = req.params;
  const user = await userModel.findOne({ _id: req.session.userId });
  const usersId = req.session.userId;
  const ticket = await ticketModel.findOne({ _id: ticketId }).populate('author assinged');
  const ticketMessages = await ticketMessageModel.find({ ticket: ticket.id }).populate('user');
  const templateData = {
    ...locals, user, ticket, ticketMessages, usersId,
  };
  res.render('pages/dashBoard/singleTicket', templateData);
};
exports.deleteTicket = async (req, res) => {
  const { ticketId } = req.params;
  const user = await userModel.findOne({ _id: req.session.userId });
  const ticket = await ticketModel.findOne({ _id: ticketId }).populate('author');
  const project = await projectModel.findOne({ _id: ticket.project });
  if (user.role === 'admin' || user === ticket.author) {
    try {
      await ticketAssingmentModel.deleteMany({ ticket });
      await ticketModel.deleteOne({ _id: ticketId });
      req.flash('messages', { type: 'success', text: 'ticket created successfully' });
      return res.redirect(`/tickets/${project.id}`);
    } catch (error) {
      req.flash('messages', { type: 'danger', text: 'sorry some error occured' });
    }
  }
  req.flash('messages', { type: 'danger', text: 'You are not authorized to delete this ticket' });
  return res.redirect(`/tickets/${project.id}`);
};

exports.ticketMessage = async (req, res) => {
  const { message } = req.body;
  const { ticketId } = req.params;

  try {
    const user = await userModel.findOne({ _id: req.session.userId });
    const ticket = await ticketModel.findOne({ _id: ticketId });
    const newMessage = await ticketMessageModel.create({ ticket, user, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const user = await userModel.findOne({ _id: req.session.userId });
  const message = await ticketMessageModel.findOne({ _id: messageId }).populate('ticket user');
  const ticketId = message.ticket.id;
  try {
    if (user.userName === message.user.userName) {
      await ticketMessageModel.deleteOne({ _id: messageId });
      req.flash('messages', { type: 'success', text: 'you deleted this message' });
      return res.redirect(`/singleTicket/${ticketId}`);
    }
    req.flash('messages', { type: 'warning', text: 'you can not delete this message' });
    return res.redirect(`/singleTicket/${ticketId}`);
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'sorry some errro occured' });
    return res.redirect(`/singleTicket/${ticketId}`);
  }
};
