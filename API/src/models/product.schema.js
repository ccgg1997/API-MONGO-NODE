const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  producto_id: {
    type: String,
    required: true,
    unique: true,
  },
  precio_regular: {
    type: Number,
    required: true,
  },
  precio_especial: [
    {
      cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
      },
      precio: {
        type: Number,
        required: true,
      },
    },
  ],
  familia_id: {
    type: String,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
