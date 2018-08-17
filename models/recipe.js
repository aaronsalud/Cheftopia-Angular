'use strict';
module.exports = (sequelize, DataTypes) => {
  var Recipe = sequelize.define('Recipe', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
      timestamps: true,
      underscored: true,
      tableName: 'recipes'
    });
  Recipe.associate = function (models) {
    // associations can be defined here
  };
  return Recipe;
};