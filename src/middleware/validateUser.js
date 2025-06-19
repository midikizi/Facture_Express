const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'Le nom doit contenir au moins 3 caractères',
        'any.required': 'Le nom est requis'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'L\'email n\'est pas valide',
        'any.required': 'L\'email est requis'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'any.required': 'Le mot de passe est requis'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'L\'email n\'est pas valide',
        'any.required': 'L\'email est requis'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Le mot de passe est requis'
    })
});

module.exports = {
    validateUser: async (req, res, next) => {
        try {
            await userSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }
    },

    validateLogin: async (req, res, next) => {
        try {
            await loginSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }
    }
}; 