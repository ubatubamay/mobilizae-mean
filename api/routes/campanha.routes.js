const express = require('express');
const router = express.Router();
const campanha = require('../controllers/campanha.controller');

router.get('/', campanha.getCampanhas);
router.post('/', campanha.registerCampanha);
router.post('/busca', campanha.buscaCamapanha);
router.get('/:id', campanha.getCampanha);

module.exports = router;