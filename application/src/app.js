const express = require('express');
const morgan = require('morgan');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const { dbConnect } = require('./api/config/db');
const fetchNotificationCount = require('./api/middlewares/notifictionCount');

const port = 5000;

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON requests
app.use(morgan('tiny'));

// templating
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout/main');

// static
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: process.env.session_key, // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
  },
}));

// flash messages
app.use(flash());

// for notification
app.use(fetchNotificationCount);

// routes
app.use('/', require('./api/routes/userRoutes'));
app.use('/', require('./api/routes/dashboardRouter'));
app.use('/', require('./api/routes/adminRoutes'));
app.use('/', require('./api/routes/projectRoutes'));
app.use('/', require('./api/routes/ticketsRouter'));

// connection to database
dbConnect().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`app listening at ${port}`);
  });
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Failed to connect to database: ${error}`);
});

module.exports = app;
