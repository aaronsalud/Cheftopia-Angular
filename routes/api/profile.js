const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Profile Model
const { Profile, User } = require('../../models');

// @route GET api/profile
// @desc Get Current User profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({
      attributes: { exclude: ['user_id'] },
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          attributes: ['id', 'name', 'avatar']
        }
      ]
    })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route GET api/profile/user/:user_id
// @desc  Get profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({
    attributes: { exclude: ['user_id'] },
    where: { user_id: req.params.user_id },
    include: [
      {
        model: User,
        as: 'user',
        required: true,
        attributes: ['id', 'name', 'avatar']
      }
    ]
  })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ error: 'There is no profile for this user', more_details: err })
    );
});

// @route GET api/profile/all
// @desc  Get all profiles
// @access Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.findAll({
    attributes: { exclude: ['user_id'] },
    include: [
      {
        model: User,
        as: 'user',
        required: true,
        attributes: ['id', 'name', 'avatar']
      }
    ]
  })
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res
        .status(404)
        .json({ error: 'There are no profiles', more_details: err })
    );
});

module.exports = router;
