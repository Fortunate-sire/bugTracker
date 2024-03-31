const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const userModel = require('../models/userModel');

/**
 *
 * Post
 * user registration route
 */

// eslint-disable-next-line consistent-return
exports.signUp = async (req, res) => {
  const locals = {
    title: 'signUp',
    messages: req.flash('messages'),
    layout: 'layout/authLayout',
  };

  try {
    if (req.method === 'POST') {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new UserModel({
        userName: req.body.email,
        firstName: req.body.firstName,
        email: req.body.email,
        password: hashPassword,
      });

      await UserModel.create(newUser);
      req.flash('messages', { type: 'success', text: 'account created successfully' });
      return res.redirect('/');
    }
  } catch (error) {
    if (error.code === 11000) {
      req.flash('messages', { type: 'warning', text: 'Sorry, email already taken' });
      return res.redirect('/signup');
    }
  }
  res.render('pages/auth/sigup', locals);
};

/**
 *
 * Post
 * user login Controller
 */

// eslint-disable-next-line consistent-return
exports.login = async (req, res) => {
  const locals = {
    title: 'login',
    messages: req.flash('messages'),
    layout: 'layout/authLayout',
  };
  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
        return res.redirect('/');
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.flash('messages', { type: 'success', text: 'logged in' });
        return res.redirect('/home');
      }
      req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
      return res.redirect('/');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    req.flash('messages', { type: 'danger', text: 'Sorry some error occured' });
    res.redirect('/');
  }
  res.render('pages/auth/login', locals);
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal Server Error');
    }
    return res.redirect('/signup');
  });
};

exports.getAllUSers = async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json(users);
};

exports.loginDemoUser = async (req, res) => {
  const locals = {
    title: 'login',
    messages: req.flash('messages'),
    layout: 'layout/authLayout',
  };
  try {
    if (req.method !== 'POST') {
      const email = 'favourokerri767@gmail.com';
      const password = '12345678';
      const user = await UserModel.findOne({ email });
      if (!user) {
        req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
        return res.redirect('/');
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.flash('messages', { type: 'success', text: 'logged in' });
        return res.redirect('/home');
      }
      req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
      return res.redirect('/');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    req.flash('messages', { type: 'danger', text: 'Sorry some error occured' });
    res.redirect('/');
  }
  res.render('pages/auth/login', locals);
};

exports.loginDemoAdmin = async (req, res) => {
  const locals = {
    title: 'login',
    messages: req.flash('messages'),
    layout: 'layout/authLayout',
  };
  try {
    if (req.method !== 'POST') {
      const email = 'favourokerri@gmail.com';
      const password = '12345678';
      const user = await UserModel.findOne({ email });
      if (!user) {
        req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
        return res.redirect('/');
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.flash('messages', { type: 'success', text: 'logged in' });
        return res.redirect('/home');
      }
      req.flash('messages', { type: 'danger', text: 'Username and/or password incorrect' });
      return res.redirect('/');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    req.flash('messages', { type: 'danger', text: 'Sorry some error occured' });
    res.redirect('/');
  }
  res.render('pages/auth/login', locals);
};
