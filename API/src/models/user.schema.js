const mongose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    deleted: { type: Boolean, default :false},
    access: { type: Boolean, default: false},
    roles:[{
        ref:"roles",
        type:mongose.Schema.Types.ObjectId
    }
    ]

},
{
    timestamps:true
}
);

userSchema.statics.comparePassword = async (password,receivedPassword) => {
    return await bcrypt.compare(password,receivedPassword);
}

module.exports = mongose.model('User', userSchema);