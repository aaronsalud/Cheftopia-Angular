const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const Sequelize = require('sequelize');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const shoppinglist = require('./routes/api/shoppinglist');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').postgresURI;

// Connect to PostgresSQL
const sequelize = new Sequelize(db, {
  dialect: 'postgres',
  operatorsAliases: false
});
sequelize
  .authenticate()
  .then(() => {
    console.log('PostgresSQL DB Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/shoppinglist', shoppinglist);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('ui/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'ui', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
