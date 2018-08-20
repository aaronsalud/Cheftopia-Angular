'use strict';
module.exports = (sequelize, DataTypes) => {
  var RecipeIngredient = sequelize.define('RecipeIngredient', {
    recipe_id: DataTypes.INTEGER,
    ingredient_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'recipe_ingredient'
  });
  RecipeIngredient.associate = function(models) {
    // associations can be defined here
  };
  return RecipeIngredient;
};