const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const apiConfig = require('../config');
const Usuario = require('../models/usuarios');
const usuarioCtrl = {};


usuarioCtrl.getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
}

usuarioCtrl.getEscolas = async (req, res) => {
    const escolas = await Usuario.find({perfil: 'escola'});
    res.json(escolas);
}

usuarioCtrl.getCidadaos = async (req, res) => {
    const cidadaos = await Usuario.find({perfil: 'cidadao'});
    res.json(cidadaos);
}

usuarioCtrl.getEscolasVerificacao = async (req, res) => {
    const escolas = await Usuario.find({perfil: 'escola', verificado: null});
    res.json(escolas);
}

usuarioCtrl.getUsuario = async (req, res) => {
    const id =  req.params.id;
    const usuario = await Usuario.findById(id);
    res.json(usuario);
}

usuarioCtrl.updateUsuario = async (req, res) => {
    const id =  req.params.id;
    await Usuario.findByIdAndUpdate(id, {$set: req.body}, {new: true});
    res.json({status: 'Usuário atualizado'});
}

usuarioCtrl.putEscolaVerificacao = async (req, res) => {
    await Usuario.findByIdAndUpdate(req.params.id, { $set: {verificado: req.body.descricao} }, {new: true})
    res.json('Verificação de escola atualizada');
}

usuarioCtrl.deleteUsuario = async (req, res) => {
    const id =  req.params.id;
    await Usuario.findByIdAndRemove(id);
    res.json({status: 'Usuário deletado'});
}

usuarioCtrl.setUsuario = async (req, res, next) => {
    console.log('entrou no setUsuario');
    if (await Usuario.findOne({ email: req.body.email })){
        return next();
    }
    var saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        usuario = new User(req.body);
        usuario.password = hash;
        usuario.save((err, registro) => {
            if(err) return console.log(err);
            res.json({status: 'Usuário registrado'});
        }); 
    });
}

module.exports = usuarioCtrl;