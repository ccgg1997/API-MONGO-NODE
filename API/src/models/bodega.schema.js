const mongoose = require('mongoose');
  
const bodegaSchema = new mongoose.Schema({
  bodegaId: {
    type: String,
    required: true,
    unique: true
  },
  bodegaNombre: {
    type: String,
    required: true,
    unique: true
  },
  activo: {
    type: Boolean,
    default: true
  }
});

bodegaSchema.index({ bodegaId: 1, bodegaNombre: 1 }, { unique: true });
module.exports = mongoose.model('Bodega', bodegaSchema);



