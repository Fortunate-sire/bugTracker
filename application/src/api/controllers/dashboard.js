// dashboard controllers
const userModel = require('../models/userModel');
const notificationModel = require('../models/notificationModels');

// eslint-disable-next-line consistent-return
exports.home = async (req, res) => {
  const locals = {
    title: 'dashboard',
    messages: req.flash('messages'),
  };

  const user = await userModel.findOne({ _id: req.session.userId });
  const allUsers = await userModel.find({});
  const templateData = {
    ...locals, user, allUsers,
  };
  res.render('pages/dashBoard/home.ejs', templateData);
};

exports.notification = async (req, res) => {
  const locals = {
    title: 'notification',
    messages: req.flash('messages'),
  };

  const user = await userModel.findOne({ _id: req.session.userId });
  const notifications = await notificationModel.find({ userId: user.id }).sort({ createdAt: -1 });
  const notificationIds = notifications.map((notification) => notification.id);
  await notificationModel.updateMany({ _id: { $in: notificationIds } }, { read: true });
  const templateData = {
    ...locals, user, notifications,
  };
  res.render('pages/dashBoard/notification.ejs', templateData);
};
