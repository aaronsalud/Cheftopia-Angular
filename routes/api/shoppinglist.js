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
      include: [{ ...modelOptions.ingredients }]
    })
      .then(shopping_lists => {
        res.json(shopping_lists);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route GET api/shoppinglist/:id
// @desc Get Shopping List by Id
// @access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ShoppingList.findById(req.params.id, {
      where: { user_id: req.user.id },
      include: [{ ...modelOptions.ingredients }]
    })
      .then(shopping_list => {
        if (!shopping_list) {
          throw { error: 'Shopping List not found' };
        }
        res.json(shopping_list);
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
        user
          .createShopping_list(newShoppingList)
          .then(createdShoppingList => {
            res.json(createdShoppingList);
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
      where: { id: req.params.id, user_id: req.user.id }
    })
      .then(([rowsUpdated, [updatedShoppingList]]) => {
        res.json(updatedShoppingList);
      })
      .catch(err =>
        res.status(404).json({ error: 'Failed to update shopping list' })
      );
  }
);

// @route DELETE api/shoppinglist/:id
// @desc Delete a Shopping List
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ShoppingList.findById(req.params.id, { where: { user_id: req.user.id } })
      .then(shoppinglist => {
        // Delete associated Ingredients
        Ingredient.destroy({
          where: {
            ingredientable_id: req.params.id,
            ingredientable: 'ShoppingList'
          }
        })
          .then(response => {
            return response;
          })
          .then(response => {
            // Delete the shopping list
            shoppinglist
              .destroy()
              .then(response => res.json({ success: true }));
          });
      })
      .catch(err =>
        res.status(404).json({ error: 'Shopping List not found ' })
      );
  }
);

// @route POST api/shoppinglist/:id/ingredient
// @desc Create an ingredient for a shopping list
// @access Private
router.post(
  '/:id/ingredient',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    const fields = ['name', 'amount'];
    let newIngredient = {};

    fields.forEach(field => {
      if (req && req.body && req.body[field]) {
        newIngredient[field] = req.body[field];
      }
    });

    ShoppingList.findById(req.params.id, { where: { user_id: req.user.id } })
      .then(shoppingList => {
        // Create new ingredient
        return shoppingList.createIngredient(newIngredient, {
          returning: true
        });
      })
      .then(response => {
        // Post Ingredient Creation
        ShoppingList.findById(req.params.id, {
          include: [modelOptions.ingredients]
        }).then(shoppinglist => res.json(shoppinglist));
      })
      .catch(err =>
        res.status(404).json({ error: 'Failed to create ingredient' })
      );
  }
);

// @route PUT api/shoppinglist/:id/ingredient/:ingredient_id
// @desc Update an Ingredient by id
// @access Private
router.put(
  '/:id/ingredient/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    const fields = ['name', 'amount'];
    let newIngredient = {};

    fields.forEach(field => {
      if (req && req.body && req.body[field]) {
        newIngredient[field] = req.body[field];
      }
    });

    // Update an ingredient
    Ingredient.update(newIngredient, {
      where: { id: req.params.ingredient_id, ingredientable: 'ShoppingList' },
      include: [
        {
          ...modelOptions.shoppinglist,
          where: { id: req.params.id, user_id: req.user.id }
        }
      ],
      returning: true
    })
      .then(([rowsUpdated, [updatedIngedient]]) => {
        return updatedIngedient;
      })
      .then(updatedIngredient => {
        ShoppingList.findById(req.params.id, {
          include: [modelOptions.ingredients]
        }).then(shoppinglist => res.json(shoppinglist));
      })
      .catch(err => res.status(404).json({ error: 'Ingredient not found' }));
  }
);

// @route DELETE api/shoppinglist/:id/ingredient/:ingredient_id
// @desc Delete an ingredient for a shopping list
// @access Private
router.delete(
  '/:id/ingredient/:ingredient_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ShoppingList.findById(req.params.id, {
      where: { user_id: req.user.id },
      include: [
        {
          ...modelOptions.ingredients,
          where: {
            id: req.params.ingredient_id,
            ingredientable: 'ShoppingList'
          }
        }
      ]
    })
      .then(shoppinglist => {
        // Delete the ingredient
        shoppinglist.ingredients[0].destroy().then(ingredient => {
          res.json({ success: true });
        });
      })
      .catch(err =>
        res
          .status(404)
          .json({ error: 'Failed to remove Ingredient from shopping list' })
      );
  }
);

module.exports = router;
