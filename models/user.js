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
  User.associate = function(models) {
    // associations can be defined here
    const { Profile, ShoppingList, UserShoppingList } = models;
    User.hasOne(Profile, { as: 'profile', foreignKey: 'user_id' });
    User.belongsToMany(ShoppingList, {
      as: 'shopping_lists',
      through: UserShoppingList,
      foreignKey: 'user_id',
      otherKey: 'shoppinglist_id'
    });
  };
  return User;
};
