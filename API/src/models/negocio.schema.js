const mongoose = require('mongoose');
const moment = require('moment');
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
    default: Date.now,
    get:formatoFecha
  },
  ultimaLlamada: {
    type: Date,
    default: Date.now,
    get:formatoFecha
    
  },active:{
    type: Boolean,
    required:true,
    default:true
  }
});

function formatoFecha(fecha){
  return moment(fecha).format('DD/MM/YYYY');
}

negocioSchema.index({ id: 1 });
module.exports = mongoose.model('Negocio', negocioSchema);