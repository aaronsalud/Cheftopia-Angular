'use strict';
module.exports = (sequelize, DataTypes) => {
  var Recipe = sequelize.define(
    'Recipe',
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'recipes'
    }
  );
  Recipe.associate = function (models) {
    const { Profile, Ingredient } = models;
    Recipe.belongsTo(Profile, {
      as: 'profile'
    });

    Recipe.hasMany(Ingredient, {
      as: 'ingredients',
      foreignKey: 'ingredientable_id',
      scope: {
        ingredientable: 'Recipe'
      }
    });
  };
  return Recipe;
};
