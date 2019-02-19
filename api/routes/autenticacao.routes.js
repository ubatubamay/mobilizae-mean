const express = require('express');
const router = express.Router();
// const handleAuthentication = require('../controllers/autenticacao.controller');
const autenticacao = require('../controllers/autenticacao.controller');

router.post('/login', autenticacao.handleAuthentication);
router.post('/mail-verify', autenticacao.verificaUsuario);
router.post('/mail-resend-verify', autenticacao.reverificaUsuario);
router.get('/mail-confirm/:token', autenticacao.confirmaUsuario);
router.post('/logout', function(req, res){
    req.logOut();
    res.redirect("/");
});

module.exports = router;
