const mongose = require('mongoose');

const userSchema = new mongose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    cedula: { type: String, required: true },
    estado: { type: Boolean, required: true }

});

module.exports = mongose.model('User', userSchema);