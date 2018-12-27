const express = require('express');
const router = express.Router();
const handleAuthentication = require('../controllers/autenticacao.controller');

router.post('/login', handleAuthentication);
router.post('/logout', function(req, res){
    req.logOut();
    res.redirect("/");
});

module.exports = router;
