'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserShoppingList = sequelize.define(
    'UserShoppingList',
    {
      user_id: DataTypes.INTEGER,
      shoppinglist_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      tableName: 'user_shoppinglist'
    }
  );
  UserShoppingList.associate = function(models) {
    // associations can be defined here
  };
  return UserShoppingList;
};
