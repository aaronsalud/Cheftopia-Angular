const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Models
const { Profile, Recipe, Ingredient } = require('../../models');

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

    Recipe.create(newRecipe, { returning: true })
      .then(createdRecipe => {
        // If ingredients array exist, do a bulk create
        const newIngredients = newRecipe.ingredients.slice();

        newIngredients.map(ingredient => {
          ingredient.ingredientable_id = createdRecipe.id;
          ingredient.ingredientable = 'Recipe';
        });

        if (newRecipe.ingredients) {
          Ingredient.bulkCreate(newIngredients, { returning: true })
            .then(createdIngredients => {
              return createdIngredients;
            })
            .then(response => {
              // Return the newly created recipe with the ingredients
              Recipe.findById(createdRecipe.id, {
                include: [modelOptions.ingredients]
              }).then(recipe => res.json(recipe));
            });
        } else {
          // Return the newly created recipe without the ingredients
          Recipe.findById(createdRecipe.id, {
            include: [modelOptions.ingredients]
          }).then(recipe => res.json(recipe));
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
  '/:id',
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

    const { name, image, description } = newRecipe;

    // Update recipe
    Recipe.update(
      { name, image, description },
      {
        returning: true,
        where: { id: req.params.id, user_id: req.user.id }
      }
    )
      .then(([rowsUpdated, [updatedRecipe]]) => {
        // Delete all associated ingredients first
        if (updatedRecipe) {
          Ingredient.destroy({
            where: {
              ingredientable_id: req.params.id,
              ingredientable: 'Recipe'
            }
          })
            .then(response => response)
            .then(response => {
              // If there are no ingredients to be updated return the recipe data
              if (!newRecipe.ingredients || newRecipe.ingredients.length == 0) {
                return Recipe.findById(req.params.id, {
                  include: [modelOptions.ingredients]
                }).then(recipe => res.json(recipe));
              }

              const newIngredients = newRecipe.ingredients.slice();

              newIngredients.map(ingredient => {
                ingredient.ingredientable_id = req.params.id;
                ingredient.ingredientable = 'Recipe';
              });

              // Create the ingredients
              Ingredient.bulkCreate(newIngredients, { returning: true })
                .then(createdIngredients => {
                  return createdIngredients;
                })
                .then(response => {
                  // Return the newly created recipe with the ingredients
                  Recipe.findById(req.params.id, {
                    include: [modelOptions.ingredients]
                  }).then(recipe => res.json(recipe));
                });
            });
        }
      })
      .catch(err =>
        res.status(404).json({ error: 'Failed to update shopping list' })
      );
  }
);

// @route DELETE api/profile/recipe/:id
// @desc  Delete a recipe
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Recipe.findById(req.params.id)
      .then(recipe => {
        if (!recipe) {
          throw { error: 'Failed to Delete recipe' };
        }
        // Destroy
        Ingredient.destroy({
          where: { ingredientable_id: req.params.id, ingredientable: 'Recipe' }
        })
          .then(response => response)
          .then(response => {
            // If there are no ingredients to be updated return the recipe data
            return recipe.destroy();
          })
          .then(response => res.json({ success: true }));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
