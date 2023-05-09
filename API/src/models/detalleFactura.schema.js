 const mongoose = require('mongoose');
 const Factura = require('./factura.schema');
 const Product = require('./product.schema');
 const Familia = require('./familia.schema');

const detalleFacturaSchema = new mongoose.Schema({
    facturaId: {
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
        min: 0
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaEliminacion: {
        type: Date,
        default: null
    },
    familia: {
        type: String,
        required: true,
    },
    detalle:[
        {
            motivo: {
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

module.exports = mongoose.model('detalleFactura', detalleFacturaSchema);