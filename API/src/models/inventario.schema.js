// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const inventarioSchema = new Schema({
//   codProducto: {
//     type: String,
//     required: true
//   },
//   productoId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Producto'
//   },
//   bodegas:[{
//     nombreBodega: {
//       type: String,
  
//     },
//     cantidad: {
//       type: Number,
//       min: 0
//     }
//   }],
//   activo: {
//     type: Boolean,
//     required: true
//   },
//   cantidadTotal: {
//     type: Number,
//     min: 0
//   }
// });


// inventarioSchema.index({ codigoProducto: 1 });



// module.exports = mongoose.model('Inventario', inventarioSchema);;


