const express = require('express');
const router = express.Router();
const estado = require('../controllers/estado.controller');

router.get('/', estado.getEstados);
router.get('/:id', estado.getEstado);
router.get('/busca/:nome', estado.getEstadoPorNome);

module.exports = router;