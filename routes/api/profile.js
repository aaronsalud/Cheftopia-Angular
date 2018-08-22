const express = require('express');
const router = express.Router();
const passport = require('passport');

const getValuesByKey = require('../../helpers/get-values-by-key');
// Load Models
const { Profile, User, Recipe, Ingredient } = require('../../models');

// Load model loading options
const modelOptions = require('../../helpers/model-options');
const loadRecipesWithIngredients = { ...modelOptions.recipes, include: [modelOptions.ingredients] };

//Load Input Validators
const validateProfileInput = require('../../validators/profile');
const validateRecipeInput = require('../../validators/recipe');

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
        modelOptions.user,
        loadRecipesWithIngredients
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
      modelOptions.user,
      {
        ...loadRecipesWithIngredients,
        where: { is_public: true }
      }
    ]
  })
    .then(profile => {
      if (!profile) {
        throw { noprofile: 'There is no profile for this user' };
      }
      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json(err)
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
      modelOptions.user,
      {
        ...loadRecipesWithIngredients,
        where: { is_public: true }
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
        .json({ error: 'There are no profiles' })
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

// @route PUT api/profile/recipe/:id
// @desc  Update a recipe from a profile
// @access Private
router.put(
  '/recipe/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Ensure that the only the user currently logged in can edit the recipe
    Profile.findOne({
      where: { user_id: req.user.id }
    })
      .then(profile => {
        const fields = ['name', 'image', 'description', 'ingredients'];
        let newRecipe = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newRecipe[field] = req.body[field];
          }
        });

        // Update recipe
        Recipe.update(newRecipe, {
          returning: true,
          where: { id: req.params.id }
        })
          .then(([rowsUpdated, [updatedRecipe]]) => {
            if (updatedRecipe) {
              res.json(updatedRecipe);
            } else {
              throw { error: 'Recipe not found' };
            }
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err =>
        res
          .status(401)
          .json({ error: 'User is unauthorized to perform this action' })
      );
  }
);

// @route DELETE api/profile/recipe/:id
// @desc  Delete a recipe from a profile
// @access Private
router.delete(
  '/recipe/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Ensure that the only the user currently logged in can edit the recipe
    Profile.findOne({
      where: { user_id: req.user.id }
    })
      .then(profile => {
        // Delete the recipe
        Recipe.destroy({
          returning: true,
          where: { id: req.params.id }
        })
          .then(deletedRecipe => {
            if (deletedRecipe) {
              // Remove deleted recipe id from the profile recipe pivot table
              profile
                .removeRecipe(req.params.id)
                .then(() => res.json({ success: true }))
                .catch(err => res.status(404).json(err));
            } else {
              throw { error: 'Recipe item not found' };
            }
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err =>
        res
          .status(401)
          .json({ error: 'User is unauthorized to perform this action' })
      );
  }
);

module.exports = router;
