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

module.exports = router;
