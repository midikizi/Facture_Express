const invoiceService = require('../services/invoiceService');

class InvoiceController {
    async createInvoice(req, res) {
        try {
            const invoice = await invoiceService.createInvoice(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            console.error('Erreur création facture:', error);
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: 'Impossible de créer la facture' }
            );
        }
    }

    async getAllInvoices(req, res) {
        try {
            const invoices = await invoiceService.getAllInvoices();
            res.status(200).json(invoices);
        } catch (error) {
            console.error('Erreur récupération factures:', error);
            res.status(500).json({ error: 'Impossible de récupérer les factures' });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const invoice = await invoiceService.getInvoiceById(req.params.id, {
                include: ['lines', 'user']
            });
            res.status(200).json(invoice);
        } catch (error) {
            console.error('Erreur récupération facture:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de récupérer la facture' 
            });
        }
    }

    async updateInvoice(req, res) {
        try {
            const invoice = await invoiceService.updateInvoice(
                req.params.id,
                req.body
            );
            res.status(200).json(invoice);
        } catch (error) {
            console.error('Erreur mise à jour facture:', error);
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: error.message || 'Impossible de mettre à jour la facture' }
            );
        }
    }

    async deleteInvoice(req, res) {
        try {
            const result = await invoiceService.deleteInvoice(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur suppression facture:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de supprimer la facture' 
            });
        }
    }

    async updateInvoiceStatus(req, res) {
        try {
            const { status } = req.body;
            const invoice = await invoiceService.updateInvoiceStatus(
                req.params.id,
                status
            );
            res.status(200).json(invoice);
        } catch (error) {
            console.error('Erreur changement statut facture:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de changer le statut de la facture' 
            });
        }
    }

    async generateInvoicePDF(req, res) {
        try {
            const pdfBuffer = await invoiceService.generatePDF(req.params.id);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=facture.pdf');
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Impossible de générer le PDF' 
            });
        }
    }
}

module.exports = new InvoiceController(); 