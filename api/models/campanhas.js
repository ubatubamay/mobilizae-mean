const mongoose = require('mongoose');
const { Schema } = mongoose;

const CampanhaSchema = new Schema({
    escola: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    tipo: { type: String },
    titulo: { type: String },
    descricao: { type: String },
    horarios: { type: String },
    materiais: [{ id: Number, nome: String, qtd: Number }],
    vagas: [{ id: Number, nome: String, qtd: Number}]
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Campanhas', CampanhaSchema);