const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(userData) {
        // Vérifier si l'email existe déjà
        const existingUser = await userRepository.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw { 
                status: 400, 
                message: 'Un utilisateur avec cet email existe déjà' 
            };
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Créer l'utilisateur
        return await userRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    async verifyUser(email, password) {
        // Trouver l'utilisateur
        const user = await userRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw { 
                status: 401, 
                message: 'Email ou mot de passe incorrect' 
            };
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw { 
                status: 401, 
                message: 'Email ou mot de passe incorrect' 
            };
        }

        return user;
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        
        if (!user) {
            throw { 
                status: 404, 
                message: 'Utilisateur non trouvé' 
            };
        }

        return user;
    }

    async updateUser(id, userData) {
        const user = await this.getUserById(id);

        // Si le mot de passe est fourni, le hasher
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // Si l'email est modifié, vérifier qu'il n'existe pas déjà
        if (userData.email && userData.email !== user.email) {
            const existingUser = await userRepository.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw { 
                    status: 400, 
                    message: 'Un utilisateur avec cet email existe déjà' 
                };
            }
        }

        return await userRepository.update(user, userData);
    }
}

module.exports = new UserService(); 