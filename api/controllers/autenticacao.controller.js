const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Token = require('../models/tokens');
const User = require('../models/usuarios');

const apiConfig = require('../config');

const authCtrl = {};

authCtrl.handleAuthentication = (req, res) => {
    User.findOne({email: req.body.email})
        .exec().then(user => {            
            if (!user) return res.status(401).send({ msg: 'Login inválido.' });
            bcrypt.compare(req.body.password, user.password, (err, result) => {

                if (err) { return res.status(500).send({ msg: err.message }); }
                if (!result) return res.status(401).send({ msg: 'Login inválido.' });
                if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Essa conta ainda não foi verificada.' });

                if(result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id,
                        iss: 'mobilizae-api'
                        },
                            apiConfig.secret,
                            {
                                expiresIn: "1h"
                            }
                    );
                    return res.status(200).json({
                        message: "Autenticado com sucesso.",
                        user: {
                            name: user.name,
                            userId: user._id,
                            perfil: user.perfil,
                            token: token
                        }                        
                        
                    });
                }
                return res.status(401).send({ msg: 'Login inválido' });               
            });
        });
}

authCtrl.verificaUsuario = async (req, res, next) => {
    await User.findOne({ email: req.body.email }, function (err, user) {

        if (user) return res.status(400).send({ msg: 'O endereço de e-mail informado já está associado à outra conta.' });

        var saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            user = new User(req.body);
            user.password = hash;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
         
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
         
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
         
                    var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'mobilizae.app@gmail.com', pass: 'Suricato8!' } });
                    var mailOptions = { 
                        from: 'Mobilizaê <mobilizae.app@gmail.com>', 
                        to: user.email, subject: 'Verificação de conta', 
                        text: 'Olá,\n\n' + 'Favor verificar sua conta clicando no seguinte link: \nhttp:\/\/localhost:3000/api/auth/mail-confirm\/' + token.token + '.\n' 
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send('Um e-mail de verificação foi encaminhado para ' + user.email + '.');
                    });
                });
            });
        });
    });
}

authCtrl.reverificaUsuario = async (req, res, next) => {
    await User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'Não foi encontrado usuário com este endereço de email' });
        if (user.isVerified) return res.status(400).send({ msg: 'Este usuário já foi verificado anteriormente. Por favor, faça o login.' });
        
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
    
            var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: 'mobilizae.app@gmail.com', pass: 'Suricato8!' } });
            var mailOptions = { 
                from: 'Mobilizaê <mobilizae.app@gmail.com>', 
                to: user.email, subject: 'Verificação de conta', 
                text: 'Olá,\n\n' + 'Favor verificar sua conta clicando no seguinte link: \nhttp:\/\/localhost:3000/api/auth/mail-confirm\/' + token.token + '.\n' 
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('Um e-mail de verificação foi encaminhado para ' + user.email + '.');
            });
        });
    });
}

authCtrl.confirmaUsuario = async (req, res, next) => {
    var token = req.params.token;

    Token.findOne({ token: token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'Não encontramos uma verificação pendente através deste link. Provavelmente, o prazo para verificação expirou.' });
 
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'Não encontramos uma verificação pendente através deste link.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'Este usuário já foi verificado anteriormente.' });
 
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("A conta foi verificada. Favor acessar sua conta.");
            });
        });
    });
}

module.exports = authCtrl;
