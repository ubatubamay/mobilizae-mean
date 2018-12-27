const express = require('express');
const router = express.Router();
const campaing = require('../controllers/campanha.controller');

router.get('/', campaing.getCampanhas);
router.post('/', campaing.registerCampanha);
router.get('/:id', campaing.getCampanha);

module.exports = router;