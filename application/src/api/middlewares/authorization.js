const userModel = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash('messages', { type: 'warning', text: 'please login to continue' });
    return res.redirect('/');
  }

  const user = await userModel.findOne({ _id: req.session.userId });
  if (user.role !== 'admin') {
    req.flash('messages', { type: 'warning', text: 'you are not authorized to access this page' });
    return res.redirect('/home');
  }

  return next();
};

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('messages', { type: 'warning', text: 'please login to continue' });
    return res.redirect('/');
  }

  return next();
};

module.exports = { isAdmin, isAuthenticated };
