'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      invoiceNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      issuerName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      issuerAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      clientAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      invoiceDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      vatActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      vatRate: {
        type: Sequelize.FLOAT,
        defaultValue: 20,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('BROUILLON', 'ATTENTE', 'PAYE', 'RETARD', 'ANNULE'),
        defaultValue: 'BROUILLON',
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invoices');
  }
};