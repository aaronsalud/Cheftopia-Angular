'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'users'
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    const { Profile, ShoppingList, Recipe } = models;
    User.hasOne(Profile, { as: 'profile', foreignKey: 'user_id' });
    User.hasMany(Recipe, {
      as: 'recipes',
      foreignKey: 'user_id'
    });
    User.hasMany(ShoppingList, {
      as: 'shopping_lists',
      foreignKey: 'user_id'
    });
  };
  return User;
};
