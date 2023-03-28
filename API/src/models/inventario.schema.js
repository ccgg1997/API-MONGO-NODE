const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  fecha: { type: Date, required: true },
  cantidad: { type: Number, required: true },
  usuario: { type: String, required: true },
});

const inventarioSchema = new mongoose.Schema({
  bodega_id: { type: String, required: true },
  cantidad: { type: Number, required: true },
  movimientos: [movimientoSchema],
});

const productoSchema = new mongoose.Schema({
  producto_id: { type: String, required: true },
  inventario: [inventarioSchema],
  activo: { type: Boolean, default: true },
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
