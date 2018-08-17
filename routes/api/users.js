const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const keys = require('../../config/keys');
// const passport = require('passport');

//Load Input Validation
// const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

// Load models
const models = require('../../models');
const { User } = models;
// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User test route works' }));

// @route GET api/users/all
// @desc Get All Users
// @access Public
router.get('/all', (req, res) => {
    User.findAll().then(data => res.json(data)).catch(err => res.json(err));
});

module.exports = router;