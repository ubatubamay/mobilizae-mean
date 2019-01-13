const Ajuda = require ('../models/ajudas');
const ajudaCtrl = {};

ajudaCtrl.getAjudas = async (req, res) => {
    const ajudas = await Ajuda.find().populate('campanha').populate('usuario');
    res.json(ajudas);
}

ajudaCtrl.registerAjuda = async (req, res) => {
    ajuda = new Ajuda(req.body);
    ajuda.save((err, registro) => {
        if(err) return console.log(err);
        res.status(200).send(registro);
    });
}

ajudaCtrl.getAjuda = async (req, res) => {
    const ajuda = await Ajuda.findById(req.params.id);
    res.json(ajuda);
}

ajudaCtrl.getAjudaPorTipo = async (req, res) => {
    await Ajuda.find({status: 'Aguardando confirmação'})
        .populate('campanha').populate('usuario').exec(function(err, ajudas) {
            if (err) throw err;
            var result = [];
            ajudas.forEach(function(ajuda) {
                if (ajuda.campanha.escola == req.params.id){
                    result.push(ajuda);
                }
            });
        res.json(result);
    });
}

ajudaCtrl.getAjudaPorUsuario = async (req, res) => {
    await Ajuda.find({usuario: req.params.id})
        .populate({path:'campanha', populate: {path: 'escola'}}).exec(function(err, ajudas) {
            if (err) throw err;
            res.json(ajudas);
    });
}

ajudaCtrl.atualizaStatus = async (req, res) => {
    await Ajuda.findByIdAndUpdate(req.params.id, { status: req.body.descricao }, {new: true})
    res.json('Status atualizado');
}



module.exports = ajudaCtrl;