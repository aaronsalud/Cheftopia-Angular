const express = require('express');
const router = express.Router();
const passport = require('passport');

const getValuesByKey = require('../../helpers/get-values-by-key');
// Load Models
const { Profile, User, Recipe, Ingredient } = require('../../models');

// Load model loading options
const modelOptions = require('../../helpers/model-options');

//Load Input Validators
const validateRecipeInput = require('../../validators/recipe');

// @route GET api/recipe
// @desc Get Current User recipes
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Recipe.findAll({
            where: { user_id: req.user.id },
            include: [modelOptions.ingredients]
        })
            .then(recipes => {
                res.json(recipes);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route POST api/recipe
// @desc  Create a recipe
// @access Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateRecipeInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

        const fields = ['name', 'image', 'description', 'ingredients'];
        let newRecipe = { user_id: req.user.id };

        fields.forEach(field => {
            if (req && req.body && req.body[field]) {
                newRecipe[field] = req.body[field];
            }
        });

        Recipe
            .create(newRecipe, { returning: true })
            .then(createdRecipe => {
                // If ingredients array exist, do a bulk create
                const newIngredients = newRecipe.ingredients.slice();

                newIngredients.map(ingredient => {
                    ingredient.ingredientable_id = createdRecipe.id;
                    ingredient.ingredientable = 'Recipe'
                });

                if (newRecipe.ingredients) {
                    Ingredient.bulkCreate(newIngredients, { returning: true }).then(createdIngredients => {
                        return createdIngredients;
                    }).then(response => {
                        // Return the newly created recipe with the ingredients
                        Recipe.findById(createdRecipe.id, { include: [modelOptions.ingredients] }).then(recipe => res.json(recipe));
                    });
                } else {
                    // Return the newly created recipe without the ingredients
                    Recipe.findById(createdRecipe.id, { include: [modelOptions.ingredients] }).then(recipe => res.json(recipe));
                }
            })
            .catch(err =>
                res.status(404).json({ error: 'Failed to create new recipe' })
            );
    }
);

// @route PUT api/recipe/:id
// @desc  Update a recipe
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
