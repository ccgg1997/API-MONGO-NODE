 const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
    inventarioId: {
        type: String,
        required: true,
        unique: true
    },
    nombreProducto:{
        type: String,
        required: true,
    }
    ,
    bodegaId: {
        type: String,
        required: true,
    },
    productoId: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaEliminacion: {
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
            }
        }
    ]

});



module.exports = mongoose.model('inventario', inventarioSchema);


