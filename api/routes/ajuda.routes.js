const express = require('express');
const router = express.Router();
const ajuda = require('../controllers/ajuda.controller');

router.get('/', ajuda.getAjudas);
router.post('/', ajuda.registerAjuda);
router.get('/filter/requisicao/escola/:id', ajuda.getAjudaPorTipo);
router.get('/filter/cidadao/:id', ajuda.getAjudaPorUsuario);
router.get('/:id', ajuda.getAjuda);
router.put('/status/:id', ajuda.atualizaStatus);

module.exports = router;