const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
    produccionId: {
        type: String,
        required: true,
        unique: true
    },
    personaId: {
        type: String,
        required: true,
    },
    nombrePersona: {
        type: String,
        required: true,
    },
    fechaInicial: {
        type: Date,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    cantidadEntregada: {
        type: Number,
        required: true,
        min: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimaFechaEntrega: {
        type: Date,
        default: null
    },
    familiaNombre: {
        type: String,
        required: true,
    },
    estilos:[
        {
            nombre: {
                type: String,
                required: true,

            },
            cantidad: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ]

});



module.exports = mongoose.model('produccion', produccionSchema);


