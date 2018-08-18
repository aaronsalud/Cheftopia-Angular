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
  Profile.associate = function(models) {
    // associations can be defined here
    const { User } = models;
    Profile.belongsTo(User, { as: 'user' });
  };
  return Profile;
};
