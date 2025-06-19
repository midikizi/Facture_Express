const Joi = require('joi');

const invoiceLineSchema = Joi.object({
    description: Joi.string().required().messages({
        'any.required': 'La description est requise'
    }),
    quantity: Joi.number().min(0).required().messages({
        'number.min': 'La quantité doit être positive',
        'any.required': 'La quantité est requise'
    }),
    unitPrice: Joi.number().min(0).required().messages({
        'number.min': 'Le prix unitaire doit être positif',
        'any.required': 'Le prix unitaire est requis'
    })
});

const invoiceLineArraySchema = Joi.array().items(invoiceLineSchema);

module.exports = {
    validateSingle: async (req, res, next) => {
        try {
            await invoiceLineSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }
    },

    validateBulk: async (req, res, next) => {
        try {
            await invoiceLineArraySchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }
    }
}; 