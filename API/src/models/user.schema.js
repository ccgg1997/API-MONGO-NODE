const mongose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    deleted: { type: Boolean, default :false},
    access: { type: Boolean, default: true},
    roles:[{
        ref:"roles",
        type:String
    }]
},
{
    timestamps:{
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timezone: 'America/Bogota' // establece la zona horaria a UTC-5
    }
});


userSchema.statics.comparePassword = async (password,receivedPassword) => {
    return await bcrypt.compare(password,receivedPassword);
}

module.exports = mongose.model('User', userSchema);