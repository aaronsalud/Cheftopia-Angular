const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const shoppinglist = require('./routes/api/shoppinglist');
const recipe = require('./routes/api/recipe');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/shoppinglist', shoppinglist);
app.use('/api/recipe', recipe);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('ui/dist/Cheftopia-Angular'));
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'ui', 'dist', 'Cheftopia-Angular', 'index.html')
    );
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
