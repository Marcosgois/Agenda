const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contato', {
        contact: {}
    });
    return;
};

exports.register = async function (req, res) {
    try {
        console.log(`Req Body: ${JSON.stringify(req.body)}`);
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => {
                return res.redirect('/contato/index');
            });
            return;
        }
        req.flash('success', 'Seu contato foi criado com sucesso!');
        req.session.save(() => {
            return res.render(`contato/index/${contact.contact._id}`);
        });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404');
    try {
        const contactNew = new Contact(req.body);
        const contact = await contactNew.searchById(req.params.id);
        console.log(contact);
        res.render('contato', { contact })
    } catch (e) {
        console.log(e);
        return res.render('404')
    }
}

exports.edit = async function (req, res) {
    if (!req.params.id) return res.render('404');
    try {
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);
        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => {
                return res.redirect('/contato/index');
            });
            return;
        }
        req.flash('success', 'Seu contato foi editado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/contato/index/${contact.contact._id}`);
        });
    } catch (e) {
        console.log(e);
        return res.render('404');
    };
}