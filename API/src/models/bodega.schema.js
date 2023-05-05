const mongoose = require('mongoose');
  
const bodegaSchema = new mongoose.Schema({
  bodegaId: {
    type: String,
    required: true
  },
  bodegaNombre: {
    type: String,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Bodega', bodegaSchema);



