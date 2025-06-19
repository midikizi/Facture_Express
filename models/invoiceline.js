'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InvoiceLine extends Model {
    /**
     * Définition des associations avec les autres modèles
     * Cette méthode est appelée automatiquement par Sequelize
     */
    static associate(models) {
      // Une ligne de facture appartient à une facture
      // La clé étrangère est 'invoiceId' et l'alias est 'invoice'
      InvoiceLine.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId',
        as: 'invoice'
      });
    }
  }

  // Initialisation du modèle avec ses attributs
  InvoiceLine.init({
    // Identifiant unique de la ligne
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID
      allowNull: false
    },
    // Description de la ligne de facture
    description: {
      type: DataTypes.STRING
    },
    // Quantité commandée (par défaut 1)
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    // Prix unitaire (par défaut 0)
    unitPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    // Total de la ligne (calculé automatiquement)
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    // Référence à la facture parente
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'InvoiceLine',
    hooks: {
      // Hook exécuté avant la sauvegarde d'une ligne
      beforeSave: (line) => {
        // Calcul automatique du total de la ligne
        line.total = line.quantity * line.unitPrice;
      },
      // Hook exécuté après la sauvegarde d'une ligne
      afterSave: async (line) => {
        // Récupère la facture associée
        const invoice = await line.getInvoice();
        // Récupère toutes les lignes de la facture
        const lines = await invoice.getLines();
        // Calcule le nouveau total de la facture
        const totalAmount = lines.reduce((sum, l) => sum + l.total, 0);
        // Met à jour le total de la facture
        await invoice.update({ totalAmount });
      },
      // Hook exécuté après la suppression d'une ligne
      afterDestroy: async (line) => {
        // Même logique que afterSave pour mettre à jour le total
        const invoice = await line.getInvoice();
        const lines = await invoice.getLines();
        const totalAmount = lines.reduce((sum, l) => sum + l.total, 0);
        await invoice.update({ totalAmount });
      }
    }
  });
  return InvoiceLine;
};