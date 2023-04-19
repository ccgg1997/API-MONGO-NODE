const mongoose = require('mongoose');
const movimientoSchema = require('./movimiento.schema');
  
const bodegaSchema = new mongoose.Schema({
  bodegaId: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  movimientos: [String],
  activo: {
    type: Boolean,
    default: true
  }
});

bodegaSchema.index({ bodegaId: 1 });

module.exports = mongoose.model('Bodega', bodegaSchema);



