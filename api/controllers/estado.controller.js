const Estado = require ('../models/estados');
const estadoCtrl = {};

estadoCtrl.getEstados = async (req, res) => {
    const estados = await Estado.find();
    res.json(estados);
}

estadoCtrl.getEstado = async (req, res) => {
    const estado = await Estado.findById(req.params.id);
    res.json(estado);
}

estadoCtrl.getEstadoPorNome = async (req, res) => {
    const estados = await Estado.find({ nome: { '$regex' : req.params.nome, '$options' : 'i' } }, 'sigla nome');
    res.json(estados);
}
module.exports = estadoCtrl;