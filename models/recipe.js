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
    const { Profile, ProfileRecipe, RecipeIngredient , Ingredient} = models;
    Recipe.belongsToMany(Profile, {
      as: 'profiles',
      through: ProfileRecipe,
      foreignKey: 'recipe_id',
      otherKey: 'profile_id'
    });

    Recipe.belongsToMany(Ingredient, {
      as: 'ingredients',
      through: RecipeIngredient,
      foreignKey: 'recipe_id',
      otherKey: 'ingredient_id'
    });
  };
  return Recipe;
};
