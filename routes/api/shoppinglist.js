const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Models
const { User, ShoppingList, Ingredient } = require('../../models');

// Load Model Options
const modelOptions = require('../../helpers/model-options');

//Load Input Validators
const validateShoppingListInput = require('../../validators/shoppinglist');
const validateIngredientsInput = require('../../validators/ingredient');

// @route GET api/shoppinglist
// @desc Get Current User shopping lists
// @params { archived: 1 | 0 }
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const isArchived =
      req.query.archived && req.query.archived == 1 ? true : false;

    ShoppingList.findAll({
      where: { archived: isArchived, user_id: req.user.id },
      include: [
        modelOptions.ingredients
      ]
    })
      .then(shopping_lists => {
        res.json(shopping_lists);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/shoppinglist
// @desc Create a Shopping List
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateShoppingListInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    User.findById(req.user.id)
      .then(user => {
        const fields = ['name', 'description'];
        let newShoppingList = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newShoppingList[field] = req.body[field];
          }
        });

        // Create new shopping list
        user.createShopping_list(newShoppingList)
          .then(createdShoppingList => {
            res.json(createdShoppingList)
          })
          .catch(err =>
            res.status(404).json({ error: 'Failed to create new shoping list' })
          );
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route PUT api/shoppinglist/:id
// @desc Update a Shopping List
// @access Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateShoppingListInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    User.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        const fields = ['name', 'description', 'archived'];
        let newShoppingList = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newShoppingList[field] = req.body[field];
          }
        });

        // Update shopping list
        ShoppingList.update(newShoppingList, {
          returning: true,
          where: { id: req.params.id }
        })
          .then(([rowsUpdated, [updatedShoppingList]]) => {
            res.json(updatedShoppingList);
          })
          .catch(err =>
            res.status(404).json({ error: 'Failed to update shopping list' })
          );
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/shoppinglist/:id
// @desc Delete a Shopping List
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateShoppingListInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Ensure that the only the user currently logged in can edit the shopping list
    User.findOne({
      where: { id: req.user.id }
    })
      .then(user => {
        // Delete the shopping list
        ShoppingList.destroy({
          returning: true,
          where: { id: req.params.id }
        })
          .then(deletedShoppingList => {
            if (deletedShoppingList) {
              // Remove deleted shopping list id from the profile recipe pivot table
              user
                .removeShopping_list(req.params.id)
                .then(() => res.json({ success: true }))
                .catch(err => res.status(404).json(err));
            } else {
              throw { error: 'Shopping List item not found' };
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

// @route POST api/shoppinglist/:id/ingredients
// @desc Create an ingredient for a shopping list
// @access Private
router.post(
  '/:id/ingredients',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    User.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        const fields = ['name', 'amount'];
        let newIngredient = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newIngredient[field] = req.body[field];
          }
        });

        ShoppingList.findById(req.params.id)
          .then(shoppingList => {
            // Create new ingredient
            Ingredient.create(newIngredient, { returning: true })
              .then(createdIngredient => {
                // Add recipe to pivot with profile
                shoppingList
                  .addIngredient(createdIngredient.id)
                  .then(response => res.json(createdIngredient))
                  .catch(err => res.status(404).json(err));
              })
              .catch(err =>
                res
                  .status(404)
                  .json({ error: 'Failed to create new ingredient' })
              );
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route PUT api/shoppinglist/ingredients/:id
// @desc Update an Ingredient by id
// @access Private
router.put(
  '/ingredients/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    User.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        const fields = ['name', 'amount'];
        let newIngredient = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newIngredient[field] = req.body[field];
          }
        });

        // Update an ingredient
        Ingredient.update(newIngredient, {
          where: { id: req.params.id },
          returning: true
        })
          .then(([rowsUpdated, [updatedIngedient]]) => {
            if (updatedIngedient) {
              res.json(updatedIngedient);
            } else {
              throw { error: 'Ingredient not found' };
            }
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/shoppinglist/:shoppinglist_id/ingredients/:ingredient_id
// @desc Delete an ingredient for a shopping list
// @access Private
router.delete(
  '/:shoppinglist_id/ingredients/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    User.findById(req.user.id)
      .then(user => {
        ShoppingList.findById(req.params.shoppinglist_id)
          .then(shoppingList => {
            // Delete ingredient
            Ingredient.destroy({
              returning: true,
              where: { id: req.params.ingredient_id }
            })
              .then(deletedIngredient => {
                if (deletedIngredient) {
                  //  Remove deleted ingredient id from the shoppinglist ingredient pivot table
                  shoppingList
                    .removeIngredient(req.params.ingredient_id)
                    .then(response => res.json({ success: true }))
                    .catch(err => res.status(404).json(err));
                } else {
                  throw { error: 'Ingredient not found' };
                }
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
