'use strict';
module.exports = (sequelize, DataTypes) => {
  var Ingredient = sequelize.define('Ingredient', {
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {
      timestamps: true,
      underscored: true,
      tableName: 'ingredients'
    });
  Ingredient.associate = function (models) {
    // associations can be defined here
    const { ShoppingList, ShoppingListIngredient, RecipeIngredient, Recipe } = models;

    ShoppingList.belongsToMany(Ingredient, {
      as: 'shopping_lists',
      through: ShoppingListIngredient,
      foreignKey: 'ingredient_id',
      otherKey: 'shoppinglist_id'
    });

    Ingredient.belongsToMany(Recipe, {
      as: 'recipes',
      through: RecipeIngredient,
      foreignKey: 'ingredient_id',
      otherKey: 'recipe_id'
    });
  };
  return Ingredient;
};