const mongoose = require('mongoose');
const { Schema } = mongoose;

const AjudaSchema = new Schema({
    status: {type: String, default: 'Aguardando confirmação' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    campanha: { type: Schema.Types.ObjectId, ref: 'Campanhas' },
    tipo: { type: String },
    contribuicao: { type: String },
    qtd: { type: Number }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
});

module.exports = mongoose.model('Ajudas', AjudaSchema);