const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
    inc_field: {
        type: Number,
        unique: true
      },
    produccionId: {
        type: String,
        required: true,
        unique: true
    },
    productoId: {
        type: String,
        required: true,
    },
    personaId: {
        type: String,
        required: true,
    },
    nombrePersona: {
        type: String,
        required: true,
    },
    fechaInicial: {
        type: String,
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    cantidadRecibida: {
        type: Number,
        default: 0,
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimaFechaEntrega: {
        type: String,
        default: null
    },
    familiaNombre: {
        type: String,
        required: true,
    },
    estilos:[
        {
            nombre: {
                type: String,
                required: true,

            },
            cantidad: {
                type: Number,
                required: true,
                min: 0
            },
            cantidadRecibida: {
                type: Number,
                default: 0,
            },
        }
    ]

});

produccionSchema.methods.incrementar = async function() {
  try{
    const ultimo = await this.constructor.findOne({}).sort('-inc_field').exec();
    const ultimoValor = ultimo ? parseInt(ultimo.inc_field, 10) : 1000000;

    // Verificar si es un documento nuevo o una actualización
    if (this.isNew) {
      this.inc_field = ultimoValor + 1;
      this.produccionId = (ultimoValor + 1).toString(16).padStart(8, '0').toUpperCase();
    }
    
  }catch(e){
    console.log("Error en incrementar: ",ultimoValor )
    console.log(e +ultimo)
  }
  };
  
produccionSchema.pre('save', async function (next) {
    if (!this.produccionId) {
      await this.incrementar();
    }
    await this.incrementar();
    next();
  });



module.exports = mongoose.model('Produccion', produccionSchema);


