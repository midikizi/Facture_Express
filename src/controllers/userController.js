const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

class UserController {
    async register(req, res) {
        try {
            const user = await userService.createUser(req.body);
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 heures
            });
            
            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Erreur inscription:', error);
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: 'Erreur lors de l\'inscription' }
            );
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.verifyUser(email, password);
            
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 heures
            });

            res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Erreur connexion:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Erreur lors de la connexion' 
            });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.userId);
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email
            });
        } catch (error) {
            console.error('Erreur récupération profil:', error);
            res.status(error.status || 500).json({ 
                error: error.message || 'Erreur lors de la récupération du profil' 
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = await userService.updateUser(req.userId, req.body);
            res.status(200).json({
                message: "Profil mis à jour avec succès",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            res.status(error.status || 500).json(
                error.errors 
                ? { errors: error.errors } 
                : { error: error.message || 'Erreur lors de la mise à jour du profil' }
            );
        }
    }
}

module.exports = new UserController(); 