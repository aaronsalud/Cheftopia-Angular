'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShoppingList = sequelize.define('ShoppingList', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    archived: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  ShoppingList.associate = function(models) {
    // associations can be defined here
  };
  return ShoppingList;
};