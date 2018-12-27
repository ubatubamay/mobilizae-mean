const Campanha = require ('../models/campanhas');
const campanhaCtrl = {};

campanhaCtrl.getCampanhas = async (req, res) => {
    const campanhas = await Campanha.find().populate('escola');
    res.json(campanhas);
}

campanhaCtrl.registerCampanha = async (req, res) => {
    // const campanha = req.body;
    const campanha = new Campanha(req.body);
    await campanha.save((err, registro) => {
        if(err) return console.log(err);
        res.status(200).send(registro);
    });
}

campanhaCtrl.getCampanha = async (req, res) => {
    const id =  req.params.id;
    const campanha = await Campanha.findById(id).populate('materiais').populate('vagas').populate('escola');
    res.json(campanha);
}

module.exports = campanhaCtrl;