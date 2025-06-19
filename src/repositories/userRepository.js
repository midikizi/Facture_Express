const models = require('../../models');

class UserRepository {
    async create(userData) {
        return await models.User.create(userData);
    }

    async findOne(options = {}) {
        return await models.User.findOne(options);
    }

    async findById(id, options = {}) {
        return await models.User.findByPk(id, options);
    }

    async update(user, data) {
        return await user.update(data);
    }
}

module.exports = new UserRepository(); 