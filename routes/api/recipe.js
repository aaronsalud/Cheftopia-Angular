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
const validateRecipeInput = require('../../validators/recipe');

// @route GET api/recipe
// @desc Get Current User recipes
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({
            where: { user_id: req.user.id },
            include: [
                loadRecipesWithIngredients
            ]
        })
            .then(profile => {
                if (!profile) {
                    throw { noprofile: 'There is no such profile which links to recipes' }
                }
                res.json(profile.recipes);
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

                profile
                    .createRecipe(newRecipe, { returning: true })
                    .then(createdRecipe => {
                        // If ingredients array exist, do a bulk create
                        const promises = [];
                        if (newRecipe.ingredients) {
                            // Ingredient.bulkCreate(newRecipe.ingredients, { returning: true }).then(ingredients => {
                            const promises = [];
                            newRecipe.ingredients.forEach(ingredient => {
                                const promise = createdRecipe.createIngredient(ingredient, { returning: true });
                                promises.push(promise);
                            });
                            Promise.all(promises).then(response => {
                                Recipe.findById(createdRecipe.id, { include: [modelOptions.ingredients] }).then(recipe => res.json(recipe));
                            });
                            // });

                        } else {
                            // Return the newly created recipe without the ingredients
                            Recipe.findById(createdRecipe.id, { include: [modelOptions.ingredients] }).then(recipe => res.json(recipe));
                        }
                    })
                    .catch(err =>
                        res.status(404).json({ error: 'Failed to create new recipe' })
                    );
            })
            .catch(err =>
                res.status(401).json({ error: 'User have not set up a profile yet' })
            );
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

// @route POST api/profile/recipe
// @desc  Add recipe to profile
// @access Private
router.post(
    '/recipe',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateRecipeInput(req.body);

        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

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

                profile
                    .createRecipe(newRecipe, { returning: true })
                    .then(createdRecipe => {
                        // If ingredients array exist, do a bulk create
                        if (newRecipe.ingredients) {
                            Ingredient.bulkCreate(newRecipe.ingredients, {
                                returning: true
                            }).then(createdIngredients => {
                                // Get newly created ingredient Ids
                                const newIngredientIds = getValuesByKey(
                                    createdIngredients,
                                    'id'
                                );
                                // Set Ids to map recipe_ingredient pivot table
                                createdRecipe.setIngredients(newIngredientIds).then(data => {
                                    // Return newly created recipe with ingredients
                                    Recipe.findById(createdRecipe.id, {
                                        include: [
                                            {
                                                model: Ingredient,
                                                as: 'ingredients',
                                                through: {
                                                    attributes: []
                                                }
                                            }
                                        ]
                                    }).then(recipe => res.json(recipe));
                                });
                            });
                        } else {
                            // Return the newly created recipe without the ingredients
                            res.json(createdRecipe);
                        }
                    })
                    .catch(err =>
                        res.status(404).json({ error: 'Failed to create new recipe' })
                    );
            })
            .catch(err =>
                res.status(401).json({ error: 'User have not set up a profile yet' })
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
