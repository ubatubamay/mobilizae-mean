const express = require('express');
const router = express.Router();

const usuario = require('../controllers/usuario.controller');

router.get('/', usuario.getUsuarios);
router.get('/cidadaos', usuario.getCidadaos);
router.get('/escolas', usuario.getEscolas);
router.get('/escolas/verificacao', usuario.getEscolasVerificacao);
router.put('/escola/verificacao/:id', usuario.putEscolaVerificacao);
router.get('/:id', usuario.getUsuario);
router.post('/cadastrar', usuario.setUsuario);
router.put('/:id', usuario.updateUsuario);
router.delete('/:id', usuario.deleteUsuario);

module.exports = router;
