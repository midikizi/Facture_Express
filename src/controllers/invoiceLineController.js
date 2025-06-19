const invoiceLineService = require('../services/invoiceLineService');

/**
 * Contrôleur gérant les requêtes HTTP pour les lignes de facture
 */
class InvoiceLineController {
    /**
     * Crée une nouvelle ligne de facture
     * Route : POST /api/invoices/:invoiceId/lines
     * 
     * @param {Object} req - Requête Express
     * @param {Object} req.params - Paramètres de l'URL
     * @param {string} req.params.invoiceId - ID de la facture
     * @param {Object} req.body - Corps de la requête
     * @param {string} req.body.description - Description de la ligne
     * @param {number} req.body.quantity - Quantité
     * @param {number} req.body.unitPrice - Prix unitaire
     * @param {Object} res - Réponse Express
     */
    async createInvoiceLine(req, res) {
        try {
            // Récupère l'ID de la facture depuis l'URL
            const { invoiceId } = req.params;
            // Combine les données du corps avec l'ID de la facture
            const lineData = { ...req.body, invoiceId };
            // Crée la ligne via le service
            const line = await invoiceLineService.createInvoiceLine(lineData);
            // Renvoie la ligne créée avec le statut 201 (Created)
            res.status(201).json(line);
        } catch (error) {
            console.error('Erreur création ligne:', error);
            // Gestion des erreurs avec messages appropriés
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: 'Impossible de créer la ligne' }
            );
        }
    }

    /**
     * Récupère toutes les lignes d'une facture
     * Route : GET /api/invoices/:invoiceId/lines
     */
    async getInvoiceLines(req, res) {
        try {
            const { invoiceId } = req.params;
            const lines = await invoiceLineService.getInvoiceLines(invoiceId);
            res.status(200).json(lines);
        } catch (error) {
            console.error('Erreur récupération lignes:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de récupérer les lignes' 
            });
        }
    }

    /**
     * Récupère une ligne de facture spécifique
     * Route : GET /api/lines/:id
     */
    async getInvoiceLine(req, res) {
        try {
            const { id } = req.params;
            const line = await invoiceLineService.getInvoiceLine(id);
            res.status(200).json(line);
        } catch (error) {
            console.error('Erreur récupération ligne:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de récupérer la ligne' 
            });
        }
    }

    /**
     * Met à jour une ligne de facture
     * Route : PUT /api/lines/:id
     */
    async updateInvoiceLine(req, res) {
        try {
            const { id } = req.params;
            const line = await invoiceLineService.updateInvoiceLine(id, req.body);
            res.status(200).json(line);
        } catch (error) {
            console.error('Erreur mise à jour ligne:', error);
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: error.message || 'Impossible de mettre à jour la ligne' }
            );
        }
    }

    /**
     * Supprime une ligne de facture
     * Route : DELETE /api/lines/:id
     */
    async deleteInvoiceLine(req, res) {
        try {
            const { id } = req.params;
            const result = await invoiceLineService.deleteInvoiceLine(id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur suppression ligne:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de supprimer la ligne' 
            });
        }
    }

    /**
     * Crée plusieurs lignes de facture en une seule fois
     * Route : POST /api/invoices/:invoiceId/lines/bulk
     */
    async bulkCreateInvoiceLines(req, res) {
        try {
            const { invoiceId } = req.params;
            // Ajoute l'ID de la facture à chaque ligne
            const lines = req.body.map(line => ({ ...line, invoiceId }));
            const result = await invoiceLineService.bulkCreateInvoiceLines(lines);
            res.status(201).json(result);
        } catch (error) {
            console.error('Erreur création multiple lignes:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de créer les lignes' 
            });
        }
    }
}

module.exports = new InvoiceLineController(); 