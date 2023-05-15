const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  inc_field: {
    type: Number,
    unique: true
  },
  id: {
    type: String,
    unique: true,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  negocioId: {
    type: String,
    required: true
  },
  negocioNombre: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaEliminacion: {
    type: Date,
    default: null
  },
  pagada: {
    type: Boolean,
    default: false
  },
  hexa: {
    type: String
  }
},{ toJSON: { virtuals: true } });

facturaSchema.methods.incrementar = async function() {
  const ultimo = await this.constructor.findOne({}).sort('-inc_field').exec();
  const ultimoValor = ultimo ? ultimo.inc_field : 0;
  this.inc_field = ultimoValor + 1;
  this.id = this.inc_field.toString(16).padStart(8, '0');
};

facturaSchema.pre('save', async function (next) {
  if (!this.inc_field) {
    await this.incrementar();
  }
  next();
});

module.exports = mongoose.model('Factura', facturaSchema);

