const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        unique: true,

    }
});

// Antes de guardar, genera el valor del identificador a partir del título y la fecha de inicio
eventoSchema.pre('save', async function (next) {
     this.identifier = await (this.title + this.start);
    next();
});

const Evento = mongoose.model('Event', eventoSchema);

module.exports = Evento;
