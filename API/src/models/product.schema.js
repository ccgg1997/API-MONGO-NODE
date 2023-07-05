const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  producto_id: {
    type: String,
    required: true,
    unique: true,
  },
  tipo: {
    type: String,
    enum: ['PRODUCTO', 'PAPEL', 'MATERIAPRIMA'],
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  }
  ,
  precio_regular: {
    type: Number,
    required: true,
  },
  precio_especial: [
    {
      cliente_id: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Cliente',
      },
      precio: {
        type: Number,
        required: false,
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
  }
});

module.exports = mongoose.model('Product', productSchema);

