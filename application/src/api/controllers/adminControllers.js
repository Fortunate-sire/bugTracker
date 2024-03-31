// dashboard controllers
const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const userModel = require('../models/userModel');
const positionModel = require('../models/positionModel');
// eslint-disable-next-line consistent-return
exports.admin = async (req, res) => {
  const locals = {
    title: 'admin',
    messages: req.flash('messages'),
  };

  const user = await UserModel.findOne({ _id: req.session.userId });
  const allUsers = await UserModel.find({});
  const positions = await positionModel.find({});
  const templateData = {
    ...locals, user, allUsers, positions,
  };
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
      const { position } = req.body;
      let userPosition = await positionModel.findOne({ position });
      if (!userPosition) {
        userPosition = await positionModel.create({ position });
      }
      const newUser = new UserModel({
        userName: req.body.email,
        firstName: req.body.firstName,
        email: req.body.email,
        role: req.body.role,
        position: userPosition,
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
      const userPosition = await positionModel.findOne({ position });
      await user.updateOne({ firstName, position: userPosition, role });
      req.flash('messages', { type: 'success', text: 'User details updated successfully' });
      return res.redirect('/admin');
    }
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    res.redirect('/admin');
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
    const userPosition = await positionModel.findOne({ _id: user.position });
    // Return user data as JSON response
    return res.json({
      firstName: user.firstName,
      email: user.email,
      position: userPosition.position,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchUser = async (req, res) => {
  const { payload } = req.body;
  const search = await userModel.find({
    $or: [
      // eslint-disable-next-line
      { userName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
      // eslint-disable-next-line
      { firstName: { $regex: new RegExp('^' + payload + '.*', 'i') } },
    ],
  }).populate('position').exec();
  res.send({ payload: search });
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

exports.deleteMultipleUsers = async (req, res) => {
  const { selected } = req.body;
  try {
    if (typeof selected === 'string') {
      const user = await userModel.findById(selected);
      if (user) {
        await user.deleteOne({ _id: selected });
      }
    } else {
      await selected.forEach(async (userId) => {
        const user = await userModel.findById(userId);
        if (user) {
          await user.deleteOne({ _id: userId });
        }
      });
    }
    req.flash('messages', { type: 'success', text: 'Users deleted successfully' });
    res.redirect('/admin');
  } catch (error) {
    req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
    res.redirect('/admin');
  }
};

exports.addPosition = async (req, res) => {
  const { position } = req.body;
  try {
    await positionModel.create({ position });
    req.flash('messages', { type: 'success', text: 'position added successfully' });
    return res.redirect('/admin');
  } catch (error) {
    if (error.code === 11000) {
      req.flash('messages', { type: 'warning', text: 'this position alredy exits' });
      return res.redirect('/admin');
    }
    return res.redirect('/admin');
  }
};

exports.edithPosition = async (req, res) => {
  const { id, positions } = req.body;
  const positionIds = id.map((positionId) => positionId);
  const Positions = positions.map((position) => position);

  for (let index = 0; index < positions.length; index += 1) {
    try {
      // eslint-disable-next-line
      const userPosition = await positionModel.findOne({ _id: positionIds[index] });
      // eslint-disable-next-line
      await userPosition.updateOne({ position: Positions[index] });
    } catch (error) {
      req.flash('messages', { type: 'danger', text: 'Sorry, some error occurred' });
      return res.redirect('/admin');
    }
  }
  req.flash('messages', { type: 'success', text: 'Positions updated successfully' });
  return res.redirect('/admin');
};

exports.deletePosition = async (req, res) => {
  const { positionId } = req.params;
  try {
    await positionModel.findByIdAndDelete(positionId);
    req.flash('messages', { type: 'success', text: 'Position deleted successfully' });
    return res.redirect('/admin');
  } catch (error) {
    req.flash('messages', { type: 'error', text: 'Sorry, some error occurred' });
    return res.redirect('/admin');
  }
};
