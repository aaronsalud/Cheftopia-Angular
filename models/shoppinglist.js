'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShoppingList = sequelize.define(
    'ShoppingList',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      archived: DataTypes.BOOLEAN
    },
    {
      underscored: true,
      tableName: 'shopping_lists'
    }
  );
  ShoppingList.associate = function(models) {
    // associations can be defined here
    const { User, UserShoppingList } = models;
    ShoppingList.belongsToMany(User, {
      as: 'users',
      through: UserShoppingList,
      foreignKey: 'shoppinglist_id',
      otherKey: 'user_id'
    });
  };
  return ShoppingList;
};
