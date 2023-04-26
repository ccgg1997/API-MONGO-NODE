const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  producto_id: {
    type: String,
    required: true,
    unique: true,
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
  },
  bodegas:[{
    nombreBodega: {
      type: String,
  
    },
    cantidad: {
      type: Number,
      min: 0
    }
  }], 
  cantidadTotal: {
    type: Number,
    min: 0
  }
});

module.exports = mongoose.model('Product', productSchema);

