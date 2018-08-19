'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProfileRecipe = sequelize.define(
    'ProfileRecipe',
    {
      profile_id: DataTypes.INTEGER,
      recipe_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      tableName: 'profile_recipe'
    }
  );
  ProfileRecipe.associate = function(models) {
    // associations can be defined here
  };
  return ProfileRecipe;
};
