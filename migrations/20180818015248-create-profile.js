'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      website: {
        type: Sequelize.STRING
      },
      bio: {
        allowNull: false,
        type: Sequelize.STRING
      },
      restaurant: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      occupation: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profiles');
  }
};
