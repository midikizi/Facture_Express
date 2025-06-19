const models = require('../../models');

class InvoiceLineRepository {
    async create(lineData) {
        return await models.InvoiceLine.create(lineData);
    }

    async findAll(options = {}) {
        return await models.InvoiceLine.findAll(options);
    }

    async findById(id, options = {}) {
        return await models.InvoiceLine.findByPk(id, options);
    }

    async update(line, data) {
        return await line.update(data);
    }

    async delete(line) {
        return await line.destroy();
    }

    async bulkCreate(lines) {
        return await models.InvoiceLine.bulkCreate(lines);
    }
}

module.exports = new InvoiceLineRepository(); 