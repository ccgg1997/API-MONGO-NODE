const mongoose = require('mongoose');
const { Schema } = mongoose;

const movimientoSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  }
});

const bodegaSchema = new Schema({
  bodegaId: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  movimientos: [movimientoSchema]
});

const inventarioSchema = new Schema({
  codigoProducto: {
    type: String,
    required: true
  },
  productoId: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  bodegas: [bodegaSchema],
  activo: {
    type: Boolean,
    required: true
  }
});

inventarioSchema.index({ codigoProducto: 1 });

const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = Inventario;
