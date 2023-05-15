 const mongoose = require('mongoose');

const detalleFacturaSchema = new mongoose.Schema({
    facturaId: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true
    },
    productos: [{
        productoId: {
            type: String,
            required: true,
        },
        productoNombre: {
            type: String,
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
        familia: {
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
        
    }]


});

module.exports = mongoose.model('detalleFactura', detalleFacturaSchema);