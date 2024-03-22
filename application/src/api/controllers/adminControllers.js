// dashboard controllers
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const userModel = require('../models/userModel');

// eslint-disable-next-line consistent-return
exports.admin = async (req, res) => {
  const locals = {
    title: 'admin',
    messages: req.flash('messages'),
  };

  if (!req.session.userId) {
    req.flash('messages', { type: 'warning', text: 'please login to continue' });
    res.redirect('/');
  }
  const user = await UserModel.findOne({ _id: req.session.userId });
  const allUsers = await UserModel.find({});
  // eslint-disable-next-line
  const templateData = Object.assign({}, locals, { user }, { allUsers});
  res.render('pages/dashBoard/admin.ejs', templateData);
};

/**
 *
 * Post
 * add user from admin
 */

// eslint-disable-next-line consistent-return
exports.addUser = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new UserModel({
        userName: req.body.email,
        firstName: req.body.firstName,
        email: req.body.email,
        position: req.body.position,
        role: req.body.role,
        password: hashPassword,
      });

      await UserModel.create(newUser);
      req.flash('messages', { type: 'success', text: 'User has been created successfully' });
      return res.redirect('/admin');
    }
  } catch (error) {
    if (error.code === 11000) {
      req.flash('messages', { type: 'warning', text: 'Sorry, email already taken' });
      return res.redirect('/admin');
    }
  }
};

// eslint-disable-next-line consistent-return
// eslint-disable-next-line consistent-return
exports.edithUser = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { userId } = req.params;
      const user = await userModel.findById(userId);
      if (!user) {
        req.flash('messages', { type: 'danger', text: 'User not found' });
        res.redirect('/admin');
      }

      const { firstName, position, role } = req.body;
      const userUpdate = { firstName, position, role };
      await user.updateOne(userUpdate);
      req.flash('messages', { type: 'success', text: 'User details updated successfully' });
      return res.redirect('/admin');
    }
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    res.redirect('/admin');
  }
};

// eslint-disable-next-line consistent-return
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      req.flash('messages', { type: 'warning', text: 'User not found' });
    }
    // Return success response
    req.flash('messages', { type: 'success', text: 'User deleted successfully' });
    return res.redirect('/admin');
  } catch (error) {
    req.flash('messages', { type: 'error', text: 'sorry some error occured' });
  }
};

// eslint-disable-next-line consistent-return
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return user data as JSON response
    return res.json({
      firstName: user.firstName,
      email: user.email,
      position: user.position,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
