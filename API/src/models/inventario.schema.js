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
    required: true
  },
  usuario: {
    type: String,
    required: true
  }
});

const bodegaSchema = new mongoose.Schema({
  bodega_id: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  movimientos: [movimientoSchema]
});

const inventarioSchema = new mongoose.Schema({
  producto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  bodegas: [bodegaSchema],
  activo: {
    type: Boolean,
    required: true
  }
});

const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = Inventario;
