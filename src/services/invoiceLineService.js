const invoiceLineRepository = require('../repositories/invoiceLineRepository');
const invoiceService = require('./invoiceService');

/**
 * Service gérant la logique métier des lignes de facture
 */
class InvoiceLineService {
    /**
     * Crée une nouvelle ligne de facture
     * @param {Object} data - Les données de la ligne
     * @param {string} data.description - Description de la ligne
     * @param {number} data.quantity - Quantité (défaut: 1)
     * @param {number} data.unitPrice - Prix unitaire (défaut: 0)
     * @param {string} data.invoiceId - ID de la facture parente
     * @returns {Promise<Object>} La ligne créée
     */
    async createInvoiceLine(data) {
        // Calcul automatique du total de la ligne
        data.total = data.quantity * data.unitPrice;
        
        // Création de la ligne dans la base de données
        const line = await invoiceLineRepository.create(data);
        
        // Mise à jour du total de la facture parente
        await this.updateInvoiceTotal(data.invoiceId);
        
        return line;
    }

    /**
     * Récupère toutes les lignes d'une facture
     * @param {string} invoiceId - ID de la facture
     * @returns {Promise<Array>} Liste des lignes de la facture
     */
    async getInvoiceLines(invoiceId) {
        return await invoiceLineRepository.findAll({
            where: { invoiceId },
            order: [['createdAt', 'ASC']] // Tri par date de création
        });
    }

    /**
     * Récupère une ligne de facture par son ID
     * @param {string} id - ID de la ligne
     * @throws {Object} Erreur 404 si la ligne n'existe pas
     * @returns {Promise<Object>} La ligne trouvée
     */
    async getInvoiceLine(id) {
        const line = await invoiceLineRepository.findById(id);
        if (!line) {
            throw { status: 404, message: 'Ligne non trouvée' };
        }
        return line;
    }

    /**
     * Met à jour une ligne de facture
     * @param {string} id - ID de la ligne à mettre à jour
     * @param {Object} data - Nouvelles données
     * @returns {Promise<Object>} La ligne mise à jour
     */
    async updateInvoiceLine(id, data) {
        const line = await this.getInvoiceLine(id);
        
        // Recalcul du total si quantité ou prix unitaire modifié
        if (data.quantity || data.unitPrice) {
            data.total = (data.quantity || line.quantity) * (data.unitPrice || line.unitPrice);
        }
        
        // Mise à jour de la ligne
        const updatedLine = await invoiceLineRepository.update(line, data);
        
        // Mise à jour du total de la facture
        await this.updateInvoiceTotal(line.invoiceId);
        
        return updatedLine;
    }

    /**
     * Supprime une ligne de facture
     * @param {string} id - ID de la ligne à supprimer
     * @returns {Promise<Object>} Message de confirmation
     */
    async deleteInvoiceLine(id) {
        const line = await this.getInvoiceLine(id);
        const invoiceId = line.invoiceId;
        
        // Suppression de la ligne
        await invoiceLineRepository.delete(line);
        
        // Mise à jour du total de la facture
        await this.updateInvoiceTotal(invoiceId);
        
        return { message: 'Ligne supprimée avec succès' };
    }

    /**
     * Crée plusieurs lignes de facture en une seule fois
     * @param {Array} lines - Tableau des lignes à créer
     * @returns {Promise<Array>} Les lignes créées
     */
    async bulkCreateInvoiceLines(lines) {
        // Calcul automatique des totaux pour chaque ligne
        const createdLines = await invoiceLineRepository.bulkCreate(
            lines.map(line => ({
                ...line,
                total: line.quantity * line.unitPrice
            }))
        );
        
        // Mise à jour du total de la facture si des lignes ont été créées
        if (createdLines.length > 0) {
            await this.updateInvoiceTotal(createdLines[0].invoiceId);
        }
        
        return createdLines;
    }

    /**
     * Met à jour le montant total d'une facture
     * @param {string} invoiceId - ID de la facture
     * @private
     */
    async updateInvoiceTotal(invoiceId) {
        // Récupère toutes les lignes de la facture
        const lines = await this.getInvoiceLines(invoiceId);
        // Calcule le nouveau total
        const totalAmount = lines.reduce((sum, line) => sum + line.total, 0);
        // Met à jour la facture
        await invoiceService.updateInvoice(invoiceId, { totalAmount });
    }
}

module.exports = new InvoiceLineService(); 