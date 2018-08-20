'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShoppingListIngredient = sequelize.define('ShoppingListIngredient', {
    shoppinglist_id: DataTypes.INTEGER,
    ingredient_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'shoppinglist_ingredient'
  });
  ShoppingListIngredient.associate = function(models) {
    // associations can be defined here
  };
  return ShoppingListIngredient;
};