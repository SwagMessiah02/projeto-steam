const {Usuario} = require('../models');

class UsuarioService {
    constructor(model) {
        this.Usuario = model;
    }

    createUser = async (userdata) => {
        const {nome, email, senha} = userdata;

        const usuario = await this.Usuario.findOne({where: {email: userdata.email}});

        console.log(usuario);

        if(usuario) {
            throw new Error("Usuário com mesmo email já existe");
        }

        await Usuario.create({nome, email, senha});
    }

    getUserByEmail = async (userdata) => {
        console.log("email " + userdata?.email + " senha " + userdata?.senha);
        const usuario = await this.Usuario.findOne({where: {email: userdata?.email, senha: userdata?.senha}});

        if(!usuario) {
            throw new Error("Email ou senha incorretos");
        }

        return usuario;
    }
}

module.exports = UsuarioService;