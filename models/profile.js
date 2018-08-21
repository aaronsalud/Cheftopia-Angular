'use strict';
module.exports = (sequelize, DataTypes) => {
  var Profile = sequelize.define(
    'Profile',
    {
      website: DataTypes.STRING,
      bio: DataTypes.STRING,
      restaurant: DataTypes.STRING,
      location: DataTypes.STRING,
      occupation: DataTypes.STRING,
      user_id: DataTypes.INTEGER
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'profiles'
    }
  );
  Profile.associate = function (models) {
    const { User, Recipe, ProfileRecipe } = models;
    Profile.belongsTo(User, { as: 'user' });
    Profile.belongsToMany(Recipe, {
      as: 'recipes',
      through: ProfileRecipe
    });
  };
  return Profile;
};
