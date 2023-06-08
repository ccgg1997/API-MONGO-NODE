const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    personaId: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true
    },
    barrio: {
        type: String,
        required: true,
    },
    fechaEliminacion: {
        type: String,
        default: null
    },
    adicional: {
        type: String,
        default: null
    },
});

module.exports = mongoose.model('persona', personaSchema);