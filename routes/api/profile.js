const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Profile Model
const { Profile, User, Recipe } = require('../../models');

//Load Input Validation
const validateProfileInput = require('../../validators/profile');

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
        },
        {
          model: Recipe,
          as: 'recipes',
          through: {
            attributes: []
          }
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
      if (!profiles || profiles.length === 0) {
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

// @route POST api/profile
// @desc Create or Edit user profile
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    const fields = ['restaurant', 'location', 'bio', 'occupation', 'website'];

    fields.forEach(field => {
      if (req.body[field]) profileFields[field] = req.body[field];
    });

    Profile.findOne({ where: { user_id: req.user.id } }).then(profile => {
      if (profile) {
        Profile.update(profileFields, {
          returning: true,
          where: { id: profile.id }
        })
          .then(([rowsUpdated, [updatedProfile]]) => res.json(updatedProfile))
          .catch(err => res.status(404).json(err));
      } else {
        profileFields.user_id = req.user.id;
        Profile.create(profileFields, {
          returning: true
        })
          .then(createdProfile => res.json(createdProfile))
          .catch(err => res.status(404).json(err));
      }
    });
  }
);

// @route DELETE api/profile/
// @desc  Delete user and profile
// @access Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Profile.findOneAndRemove({ user: req.user.id }).then(profile => {
    //   User.findOneAndRemove({ _id: req.user.id })
    //     .then(() => res.json({ success: true }))
    //     .catch(err => res.status(404).json(err));
    // });

    Profile.destroy({ returning: true, where: { user_id: req.user.id } })
      .then(profile => {
        if (profile) {
          User.destroy({
            returning: true,
            where: { id: profile.user_id }
          })
            .then(() => res.json({ success: true }))
            .catch(err => res.status(404).json(err));
        } else {
          res.status(404).json({
            error: 'No profiles to delete for this user'
          });
        }
      })
      .catch(err =>
        res.status(404).json({
          error: 'Profile not found',
          more_details: err
        })
      );
  }
);

module.exports = router;
