const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Profile Model
const {
  Profile,
  User,
  ShoppingList,
  UserShoppingList
} = require('../../models');

// @route GET api/shoppinglist
// @desc Get Current User shoppinglist
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

module.exports = router;
