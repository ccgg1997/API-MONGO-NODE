const mongoose = require('mongoose');
const movimientoSchema = require('./movimiento.schema');
  
const bodegaSchema = new mongoose.Schema({
  bodegaId: {
    type: String,
    required: true
  },
  bodegaNombre: {
    type: String,
    required: true
  },
  cantidadTotal: {
    type: Number,
    required: true,
    min: 0
  },
  cantidadProducto: [{
    nombreProducto: {
    type:String,
    },
    cantidad: {
      type: Number,
      min: 0
    }
  }],
  activo: {
    type: Boolean,
    default: true
  }
});

bodegaSchema.index({ bodegaId: 1 });

module.exports = mongoose.model('Bodega', bodegaSchema);



