const mongoose = require('mongoose');


const movimientoSchema = new mongoose.Schema({
    tipo: {
      type: String,
      enum: ['ENTRADA', 'SALIDA'],
      required: true
    },
    fecha: {
      type: Date,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0
    },
    usuario: {
      type: String,
      required: true,
      trim: true
    },
    productoId: {
      type: String,
      ref: 'Producto',
      required: true
    },
    bodegaId: {
        type: String,
        required: true
    },
    activo: {
      type: Boolean,
      default: true
    },
    fechaEliminacion: {
      type: Date,
      default: null
    },
    categoria: {
      type: String,
      enum:['PRODUCCION', 'VENTA', 'DEVOLUCION','SURTIDOENTREBODEGA'],
      required: true
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

module.exports =  mongoose.model('Movimiento', movimientoSchema);