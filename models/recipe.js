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
  Recipe.associate = function (models) {
    const { User, Ingredient } = models;
    Recipe.belongsTo(User, {
      as: 'user'
    });

    Recipe.hasMany(Ingredient, {
      as: 'ingredients',
      foreignKey: 'ingredientable_id',
      scope: {
        ingredientable: 'Recipe'
      }
    });
  };
  return Recipe;
};
