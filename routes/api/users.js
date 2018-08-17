const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validators/register');
const validateLoginInput = require('../../validators/login');

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

// @route POST api /users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            });

            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            };

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    User.create(newUser)
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api /users/login
// @desc Login user / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ where: { email } }).then(user => {
        //Check for user
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            // If password is incorrect throw an error
            if (!isMatch) {
                errors.password = 'Password incorrect';
                return res.status(400).json(errors);
            }

            // Sign Token with payload and set token expiry to a week
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 604800 },
                (err, token) => {
                    res.json({ success: true, token: 'Bearer ' + token });
                }
            );
        });
    });
});


// @route Get api /users/current
// @desc Return current user
// @access Private
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);

module.exports = router;