const userModel = require('../models/userModel');

const adminAuth = async (req, res, next) => {
  if (!req.session.userId) {
    req.flash('messages', { type: 'warning', text: 'please login to continue' });
    res.redirect('/');
  } else {
    const user = await userModel.findOne({ _id: req.session.userId });
    if (user.role !== 'admin') {
      req.flash('messages', { type: 'warning', text: 'you are not authorized to access this page' });
      return res.redirect('/home');
    }
  }

  next();
};

module.exports = { adminAuth };
