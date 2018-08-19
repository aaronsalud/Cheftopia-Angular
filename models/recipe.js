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
  Recipe.associate = function(models) {
    const { Profile, ProfileRecipe } = models;
    Recipe.belongsToMany(Profile, {
      as: 'profiles',
      through: ProfileRecipe
      // foreignKey: 'profile_id'
    });
  };
  return Recipe;
};
