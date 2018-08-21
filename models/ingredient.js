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
  };
  return Ingredient;
};