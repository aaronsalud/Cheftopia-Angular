const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Models
const { User, ShoppingList } = require('../../models');

//Load Input Validators
const validateShoppingListInput = require('../../validators/shoppinglist');

// @route GET api/shoppinglist
// @desc Get Current User shopping list
// @params { archived: 1 | 0 }
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const isArchived =
      req.query.archived && req.query.archived == 1 ? true : false;

    User.findOne({
      where: {
        id: req.user.id
      },
      include: [
        {
          model: ShoppingList,
          as: 'shopping_lists',
          where: { archived: isArchived },
          through: { attributes: [] },
          required: false
        }
      ]
    })
      .then(user => {
        if (!user) {
          throw { error: 'User not found' };
        }
        res.json(user.shopping_lists);
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

    User.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        const fields = ['name', 'description'];
        let newShoppingList = {};

        fields.forEach(field => {
          if (req && req.body && req.body[field]) {
            newShoppingList[field] = req.body[field];
          }
        });

        // Create new shopping list
        ShoppingList.create(newShoppingList)
          .then(createdShoppingList => {
            // Add shoppinglist to pivot with user
            user
              .addShopping_list(createdShoppingList.id)
              .then(response => res.json(createdShoppingList))
              .catch(err => res.status(404).json(err));
          })
          .catch(err =>
            res.status(404).json({ error: 'Failed to create new recipe' })
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

module.exports = router;
