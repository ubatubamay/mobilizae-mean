const mongoose = require('mongoose');
const { Schema } = mongoose;

const EstadoSchema = new Schema({
    sigla: { type: String },
    nome: { type: String },
    cidades: [{ type: String}]
});

module.exports = mongoose.model('Estados', EstadoSchema);