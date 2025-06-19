const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const userService = require('../services/userService');

module.exports = async (req, res, next) => {
    try {
        // Récupérer le token du header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Token d\'authentification manquant' 
            });
        }

        // Vérifier le format du token
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ 
                error: 'Format de token invalide' 
            });
        }

        const token = parts[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, config.secret);
        
        // Vérifier que l'utilisateur existe toujours
        const user = await userService.getUserById(decoded.id);
        
        // Ajouter l'ID de l'utilisateur à la requête
        req.userId = user.id;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        console.error('Erreur authentification:', error);
        res.status(500).json({ error: 'Erreur lors de l\'authentification' });
    }
}; 