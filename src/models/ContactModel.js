const mongoose = require('mongoose');
const validate = require('validator');

const ContactSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype.register = async function () {
    this.validate();

    if (this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);
};

Contact.prototype.validate = function () {
    this.cleanUp();
    // Validate if emails is an email
    if (this.body.email && !validate.default.isEmail(this.body.email)) this.errors.push('E-mail Invalido!')
    if (!this.body.nome) this.errors.push('Nome é obrigatório!')
    if (!this.body.email && !this.body.telefone) this.errors.push('Obrigatório email ou telefone para criar o contato!')
};

Contact.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
};

module.exports = Contact;
