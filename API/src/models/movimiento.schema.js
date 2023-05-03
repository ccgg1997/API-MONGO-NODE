const mongoose = require('mongoose');


const movimientoSchema = new mongoose.Schema({
    tipo: {
      type: String,
      enum: ['entrada', 'salida'],
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
    }
  });

module.exports =  mongoose.model('Movimiento', movimientoSchema);