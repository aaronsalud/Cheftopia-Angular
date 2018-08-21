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
  ShoppingList.associate = function (models) {
    // associations can be defined here
    const { User, Ingredient, UserShoppingList } = models;
    ShoppingList.belongsToMany(User, {
      as: 'users',
      through: UserShoppingList,
      foreignKey: 'shoppinglist_id',
      otherKey: 'user_id'
    });

    ShoppingList.hasMany(Ingredient, {
      as: 'ingredients',
      foreignKey: 'ingredientable_id',
      scope: {
        ingredientable: 'ShoppingList'
      }
    });
  };
  return ShoppingList;
};
