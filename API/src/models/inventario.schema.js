const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  bodegas:{
    type: Schema.Types.ObjectId,
    ref: 'Bodega',
    required: true,
  },
  activo: {
    type: Boolean,
    required: true
  },
  cantidadTotal: {
    type: Number,
    required: true,
    min: 0
  }
});

inventarioSchema.index({ codigoProducto: 1 });

const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = {Inventario};


