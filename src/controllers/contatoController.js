const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contato');
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