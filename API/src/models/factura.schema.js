const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique: true
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
});

module.exports = mongoose.model('Factura', facturaSchema);
