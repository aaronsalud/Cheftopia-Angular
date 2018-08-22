// Load Models
const { User, Recipe, Ingredient, ShoppingList } = require('../models');
const modelOptions = {
  user: {
    model: User,
    as: 'user',
    required: true,
    attributes: ['id', 'name', 'avatar']
  },
  recipes: {
    model: Recipe,
    as: 'recipes',
    required: false,
    through: { attributes: [] }
  },

  ingredients: {
    model: Ingredient,
    as: 'ingredients',
    attributes: { exclude: ['ingredientable', 'ingredientable_id'] },
    required: false
  },
  shoppinglist: {
    model: ShoppingList,
    as: 'shopping_lists',
    through: { attributes: [] },
    required: false
  }
};

module.exports = modelOptions;
