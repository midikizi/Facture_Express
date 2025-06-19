const { Op } = require('sequelize');
const models = require('../../models');

class InvoiceRepository {
    async create(invoiceData) {
        return await models.Invoice.create(invoiceData);
    }

    async findAll(options = {}) {
        return await models.Invoice.findAll(options);
    }

    async findById(id, options = {}) {
        return await models.Invoice.findByPk(id, options);
    }

    async findOne(options = {}) {
        return await models.Invoice.findOne(options);
    }

    async update(invoice, data) {
        return await invoice.update(data);
    }

    async delete(invoice) {
        return await invoice.destroy();
    }
}

module.exports = new InvoiceRepository();