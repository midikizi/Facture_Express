const express = require('express');
const router = express.Router();
const invoiceLineController = require('../controllers/invoiceLineController');
const { validateSingle, validateBulk } = require('../middleware/validateInvoiceLine');

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceLine:
 *       type: object
 *       required:
 *         - description
 *         - quantity
 *         - unitPrice
 *         - invoiceId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unique de la ligne de facture
 *         description:
 *           type: string
 *           description: Description de la ligne
 *         quantity:
 *           type: number
 *           description: Quantité
 *         unitPrice:
 *           type: number
 *           description: Prix unitaire
 *         totalAmount:
 *           type: number
 *           description: Montant total de la ligne
 *         invoiceId:
 *           type: string
 *           format: uuid
 *           description: ID de la facture associée
 */

/**
 * @swagger
 * /invoices/{invoiceId}/lines:
 *   post:
 *     summary: Ajouter une ligne à une facture
 *     tags: [Invoice Lines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceLine'
 *     responses:
 *       201:
 *         description: Ligne de facture créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceLine'
 */
router.post('/invoices/:invoiceId/lines', validateSingle, invoiceLineController.createInvoiceLine);

/**
 * @swagger
 * /invoices/{invoiceId}/lines/bulk:
 *   post:
 *     summary: Ajouter plusieurs lignes à une facture
 *     tags: [Invoice Lines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/InvoiceLine'
 *     responses:
 *       201:
 *         description: Lignes de facture créées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InvoiceLine'
 */
router.post('/invoices/:invoiceId/lines/bulk', validateBulk, invoiceLineController.bulkCreateInvoiceLines);

/**
 * @swagger
 * /invoices/{invoiceId}/lines:
 *   get:
 *     summary: Récupérer toutes les lignes d'une facture
 *     tags: [Invoice Lines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture
 *     responses:
 *       200:
 *         description: Liste des lignes de facture
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InvoiceLine'
 */
router.get('/invoices/:invoiceId/lines', invoiceLineController.getInvoiceLines);

// Routes pour une ligne spécifique
router.get('/lines/:id', invoiceLineController.getInvoiceLine);

/**
 * @swagger
 * /invoices/{invoiceId}/lines/{lineId}:
 *   put:
 *     summary: Mettre à jour une ligne de facture
 *     tags: [Invoice Lines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceLine'
 *     responses:
 *       200:
 *         description: Ligne de facture mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvoiceLine'
 */
router.put('/lines/:id', validateSingle, invoiceLineController.updateInvoiceLine);

/**
 * @swagger
 * /invoices/{invoiceId}/lines/{lineId}:
 *   delete:
 *     summary: Supprimer une ligne de facture
 *     tags: [Invoice Lines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ligne de facture supprimée
 */
router.delete('/lines/:id', invoiceLineController.deleteInvoiceLine);

module.exports = router; 