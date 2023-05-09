const mongoose =  require('mongoose');

const familiaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    estilos: [{
        nombre: {
            type: String,
            required: true 
    }}],
});

module.exports =mongoose.model( 'Familia', familiaSchema);