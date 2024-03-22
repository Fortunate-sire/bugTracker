// dashboard controllers
const userModel = require('../models/userModel');

// eslint-disable-next-line consistent-return
exports.home = async (req, res) => {
  const locals = {
    title: 'dashboard',
    messages: req.flash('messages'),
  };

  if (!req.session.userId) {
    req.flash('messages', { type: 'warning', text: 'please login to continue' });
    return res.redirect('/');
  }
  const user = await userModel.findOne({ _id: req.session.userId });
  const allUsers = await userModel.find({});
  // eslint-disable-next-line
  const templateData = Object.assign({}, locals, { user }, { allUsers});
  res.render('pages/dashBoard/home.ejs', templateData);
};
