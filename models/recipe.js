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
    const { Profile, ProfileRecipe, Ingredient } = models;
    Recipe.belongsToMany(Profile, {
      as: 'profiles',
      through: ProfileRecipe,
      foreignKey: 'recipe_id',
      otherKey: 'profile_id'
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
