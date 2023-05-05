const mongoose = require('mongoose');


const negocioSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  negocio: {
    type: String,
    required: true
  },
  duenio: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  barrio: {
    type: String,
    required: true
  },
  ultimoPedido: {
    type: Date,
    required:true,
  },
  ultimaLlamada: {
    type: String,
    required:true
    
  },
  active:{
    type: Boolean,
    required:true,
    default:true
  }
});




negocioSchema.index({ id: 1 });
module.exports = mongoose.model('Negocio', negocioSchema);