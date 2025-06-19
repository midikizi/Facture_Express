const Joi = require('joi');

const invoiceSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'Le nom doit contenir au moins 3 caractères',
        'any.required': 'Le nom est requis'
    }),
    invoiceNumber: Joi.string().optional().messages({
        'any.required': 'Le numéro de facture est requis'
    }),
    issuerName: Joi.string(),
    issuerAddress: Joi.string(),
    clientName: Joi.string(),
    clientAddress: Joi.string(),
    invoiceDate: Joi.date().optional().messages({
        'any.required': 'La date de facture est requise'
    }),
    dueDate: Joi.date().optional().messages({
        'any.required': 'La date d\'échéance est requise'
    }),
    vatActive: Joi.boolean(),
    vatRate: Joi.number().min(0).max(100),
    status: Joi.string().valid('BROUILLON', 'ATTENTE', 'PAYE', 'RETARD', 'ANNULE'),
    totalAmount: Joi.number().min(0),
    userId: Joi.string().uuid()
});

module.exports = async (req, res, next) => {
    try {
        await invoiceSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        res.status(400).json({
            errors: error.details.map(detail => detail.message)
        });
    }
}; 