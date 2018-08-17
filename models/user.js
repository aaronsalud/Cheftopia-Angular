'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {
      timestamps: true,
      underscored: true,
      tableName: 'users'
    });
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};