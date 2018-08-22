// Load Models
const { User, Recipe, Ingredient, ShoppingList, Profile } = require('../models');
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
    attributes: { exclude: ['profile_id'] }
  },
  profile: {
    model: Profile,
    as: 'profile',
    required: false
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
    attributes: { exclude: ['user_id'] },
    required: false
  }
};

module.exports = modelOptions;
