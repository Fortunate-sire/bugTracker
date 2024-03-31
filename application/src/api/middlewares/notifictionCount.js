const userModel = require('../models/userModel');
const notificationModel = require('../models/notificationModels');

async function fetchNotificationCount(req, res, next) {
  if (req.session && req.session.userId) {
    const user = await userModel.findOne({ _id: req.session.userId });
    const notificationsCount = await notificationModel.countDocuments({
      userId: user.id,
      read: false,
    });
    res.locals.notificationsCount = notificationsCount;
  } else {
    res.locals.notificationsCount = 0; // Set to 0 if no user is logged in
  }
  next();
}

module.exports = fetchNotificationCount;
