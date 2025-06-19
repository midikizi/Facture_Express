const invoiceRepository = require('../repositories/invoiceRepository');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

class InvoiceService {
    async validateInvoiceData(data) {
        const errors = [];
        if (!data.name || data.name.trim().length < 3) {
            errors.push('Le nom de la facture doit contenir au moins 3 caractères');
        }
        // Ajoute d'autres validations selon ton besoin
        return errors;
    }

    async createInvoice(data) {
        // Génération automatique des données
        data.invoiceNumber = await this.generateInvoiceNumber();
        data.invoiceDate = new Date().toISOString().split('T')[0]; // Date du jour
        data.dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +30 jours
        data.status = 'BROUILLON';
        
        const errors = await this.validateInvoiceData(data);
        if (errors.length > 0) {
            throw { status: 400, errors };
        }
        return await invoiceRepository.create(data);
    }

    async getAllInvoices(options = {}) {
        // Modification pour ne retourner que les attributs demandés
        const defaultOptions = {
            attributes: ['totalAmount', 'status', 'name', 'invoiceNumber'],
            ...options
        };
        return await invoiceRepository.findAll(defaultOptions);
    }

    async getInvoiceById(id, options = {}) {
        const invoice = await invoiceRepository.findById(id, options);
        if (!invoice) {
            throw { status: 404, message: 'Facture non trouvée' };
        }
        return invoice;
    }

    async updateInvoice(id, data) {
        const invoice = await this.getInvoiceById(id);
        return await invoiceRepository.update(invoice, data);
    }

    async deleteInvoice(id) {
        const invoice = await this.getInvoiceById(id);
        await invoiceRepository.delete(invoice);
        return { message: 'Facture supprimée avec succès' };
    }

    async updateInvoiceStatus(id, status) {
        const validStatuses = ['BROUILLON', 'ATTENTE', 'PAYE', 'RETARD', 'ANNULE'];
        if (!validStatuses.includes(status)) {
            throw { status: 400, message: 'Statut invalide' };
        }

        const invoice = await this.getInvoiceById(id);
        return await invoiceRepository.update(invoice, { status });
    }

    async generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        // Trouver la dernière facture du mois
        const lastInvoice = await invoiceRepository.findOne({
            where: {
                invoiceNumber: {
                    [Op.like]: `FACT-${year}${month}%`
                }
            },
            order: [['createdAt', 'DESC']]
        });

        let sequence = '001';
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-3));
            sequence = String(lastSequence + 1).padStart(3, '0');
        }

        return `FACT-${year}${month}${sequence}`;
    }

    async generatePDF(id) {
        const invoice = await this.getInvoiceById(id, {
            include: ['lines', 'user']
        });

        // Création du PDF avec PDFKit
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        // En-tête
        doc.fontSize(20).text('FACTURE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Numéro: ${invoice.invoiceNumber}`);
        doc.text(`Date: ${invoice.invoiceDate}`);
        doc.text(`Échéance: ${invoice.dueDate}`);
        
        // Informations client et émetteur
        doc.moveDown();
        doc.text('Émetteur:', { underline: true });
        doc.text(invoice.issuerName);
        doc.text(invoice.issuerAddress);
        
        doc.moveDown();
        doc.text('Client:', { underline: true });
        doc.text(invoice.clientName);
        doc.text(invoice.clientAddress);

        // Lignes de facture
        doc.moveDown();
        doc.text('Détail:', { underline: true });
        invoice.lines.forEach(line => {
            doc.text(`${line.description} - Qté: ${line.quantity} - PU: ${line.unitPrice}€ - Total: ${line.total}€`);
        });

        // Totaux
        doc.moveDown();
        doc.text(`Total HT: ${invoice.totalAmount}€`);
        if (invoice.vatActive) {
            const vat = invoice.totalAmount * (invoice.vatRate / 100);
            doc.text(`TVA (${invoice.vatRate}%): ${vat}€`);
            doc.text(`Total TTC: ${invoice.totalAmount + vat}€`);
        }

        doc.end();

        return Buffer.concat(buffers);
    }
}

module.exports = new InvoiceService();