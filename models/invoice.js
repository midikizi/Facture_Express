'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Invoice.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Invoice.hasMany(models.InvoiceLine, {
        foreignKey: 'invoiceId',
        as: 'lines',
        onDelete: 'CASCADE'
      });
    }
  }
  Invoice.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    issuerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issuerAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clientAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      }
    },
    vatActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    vatRate: {
      type: DataTypes.FLOAT,
      defaultValue: 20,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('BROUILLON', 'ATTENTE', 'PAYE', 'RETARD', 'ANNULE'),
      defaultValue: 'BROUILLON',
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};