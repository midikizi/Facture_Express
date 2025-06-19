const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const validateInvoice = require('../middleware/validateInvoice');

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unique de la facture
 *         invoiceNumber:
 *           type: string
 *           description: Numéro unique de la facture (généré automatiquement)
 *         name:
 *           type: string
 *           description: Nom/Description de la facture
 *         issuerName:
 *           type: string
 *           description: Nom de l'émetteur
 *         issuerAddress:
 *           type: string
 *           description: Adresse de l'émetteur
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         clientAddress:
 *           type: string
 *           description: Adresse du client
 *         invoiceDate:
 *           type: string
 *           format: date
 *           description: Date de la facture (générée automatiquement)
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Date d'échéance (générée automatiquement, +30 jours)
 *         vatActive:
 *           type: boolean
 *           description: TVA active ou non
 *         vatRate:
 *           type: number
 *           description: Taux de TVA
 *         status:
 *           type: string
 *           enum: [BROUILLON, ATTENTE, PAYE, RETARD, ANNULE]
 *           description: Statut de la facture (BROUILLON par défaut)
 *         totalAmount:
 *           type: number
 *           description: Montant total de la facture
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Créer une nouvelle facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom/Description de la facture (minimum 3 caractères)
 *               issuerName:
 *                 type: string
 *                 description: Nom de l'émetteur
 *               issuerAddress:
 *                 type: string
 *                 description: Adresse de l'émetteur
 *               clientName:
 *                 type: string
 *                 description: Nom du client
 *               clientAddress:
 *                 type: string
 *                 description: Adresse du client
 *               vatActive:
 *                 type: boolean
 *                 description: TVA active ou non
 *               vatRate:
 *                 type: number
 *                 description: Taux de TVA
 *     responses:
 *       201:
 *         description: Facture créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 */
router.post('/', validateInvoice, invoiceController.createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Récupérer toutes les factures (totalAmount, status, name, invoiceNumber)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des factures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   totalAmount:
 *                     type: number
 *                     description: Montant total de la facture
 *                   status:
 *                     type: string
 *                     enum: [BROUILLON, ATTENTE, PAYE, RETARD, ANNULE]
 *                     description: Statut de la facture
 *                   name:
 *                     type: string
 *                     description: Nom de la facture
 *                   invoiceNumber:
 *                     type: string
 *                     description: Numéro de la facture
 */
router.get('/', invoiceController.getAllInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Récupérer une facture par son ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture
 *     responses:
 *       200:
 *         description: Facture trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Facture non trouvée
 */
router.get('/:id', invoiceController.getInvoiceById);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Mettre à jour une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Facture mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 */
router.put('/:id', validateInvoice, invoiceController.updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facture supprimée
 */
router.delete('/:id', invoiceController.deleteInvoice);

/**
 * @swagger
 * /invoices/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [BROUILLON, ATTENTE, PAYE, RETARD, ANNULE]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.put('/:id/status', invoiceController.updateInvoiceStatus);

/**
 * @swagger
 * /invoices/{id}/pdf:
 *   get:
 *     summary: Générer le PDF d'une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', invoiceController.generateInvoicePDF);

module.exports = router; 