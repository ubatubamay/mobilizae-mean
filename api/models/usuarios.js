const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({
    perfil: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nome: { type: String, required: true },
    sobrenome: { type: String },
    sobre: { type: String },
    cpf: { type: String },
    data_nascimento: { type: String },
    endereco: {
        logradouro: { type: String }, 
        numero: { type: Number }, 
        bairro: { type: String }, 
        cidade: { type: String, required: true }, 
        uf: { type: String, required: true }
    },  
    rede: { type: String },
    etapa: { type: String }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);