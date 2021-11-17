const mongoose = require('mongoose');
const validate = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {

    this.validate();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    } else if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha Inválida.');
      return;
    }
  }

  async register() {

    this.validate();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) {
      this.errors.push('Usuário já existe.');
      return;
    }
    return;
  }

  validate() {
    this.cleanUp();

    // Validate if emails is an email
    if (!validate.default.isEmail(this.body.email)) this.errors.push('E-mail Invalido!')
    // Validate if the password is bigger or equal then 6 digits
    if (this.body.password.length < 6) this.errors.push('Senha precisa conter mais de 6 caracteres')
    return;
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    // To my body have only email and password after save in database
    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;
