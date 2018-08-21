// Load Models
const {  User, Recipe, Ingredient } = require('../models');
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
    }
}

module.exports = modelOptions;