const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
    produccionId: {
        type: String,
        required: true,
        unique: true
    },
    productoId: {
        type: String,
        required: true,
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
        type: String,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    cantidadRecibida: {
        type: Number,
        default: 0,
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimaFechaEntrega: {
        type: String,
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
            },
            cantidadRecibida: {
                type: Number,
                default: 0,
            },
        }
    ]

});



module.exports = mongoose.model('Produccion', produccionSchema);


