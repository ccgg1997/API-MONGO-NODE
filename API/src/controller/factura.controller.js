const { request } = require('express');
const facturaSchema = require('../models/factura.schema');
const detalleSchema = require('../models/detalleFactura.schema');
const negocioSchema = require('../models/negocio.schema');
const productoSchema = require('../models/product.schema');
const moment = require('moment-timezone');

// Función para obtener todas las facturas
const getFactura = async (req, res) => {
    try {
        const facturas = await facturaSchema.find({activo : true});
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Función para obtener una factura
const getOneFactura = async (req, res) => {
    try {
        const id = req.params.id;
        if (id == null || id == undefined || id == "" || id == " ") {
            return res.status(400).json({ message: 'Falta el id' })
        };
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

// Función para crear una factura
const createFactura = async (req, res) => {
    //iniciar transaccion
    const session = await facturaSchema.startSession();
    session.startTransaction();
    try {
        //obtener datos
        const { negocioId, negocioNombre, total,productos, facturaId } = req.body;
        const fecha = new Date(moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss'));

        //validar datos
        if(validacion( [negocioId, negocioNombre, total,productos, facturaId])){
            return res.status(400).json({ message: 'Faltan datos o datos incorrectos' });
        }

        //validacion de detalle de productos
        for(let i=0; i<productos.length; i++){
            
            //validacion deproducto id
            if(validacion([productos[i].productoId])){
            return res.status(400).json({ message: 'datos incompletos en producto' })}

            // verificacion que producto id existe
            const productoExiste= await productoSchema.findOne({ producto_id: productos[i].productoId });
            if (validacion([productoExiste])) {
                return res.status(400).json({ message: 'Producto no existe, ingrese producto valido para la factura' })
            }

            //validacion de cantidad
            if(validacion([productos[i].cantidad])|| productos[i].cantidad <= 0){
            return res.status(400).json({ message: 'Falta cantidad de producto'+productos[i].productoId })}

            //validacion de familia
            if(validacion([productos[i].familia]) ){
            return res.status(400).json({ message: 'Falta familia de producto'+productos[i].productoId })}

            const detalleProducto = new detalleSchema({
                facturaId: facturaId,
                productoId: productos[i].productoId,
                productoNombre: productos[i].productoNombre,
                cantidad: productos[i].cantidad,
                precio:  productos[i].precio,
                familia: productos[i].familia,
                fecha: fecha,
                detalle: productos[i].detalle,
                
            });
            console.log("check piont de detalle: ", detalleProducto);
            await detalleProducto.save({ session: session });
        }

        //validacion que negocio existe
        const negocioExiste= await negocioSchema.findOne({ id: negocioId });
        if (validacion([negocioExiste])) {
            return res.status(400).json({ message: 'Negocio no existe, ingrese negocio valido para la factura' })
        }
        console.log("check piont2 de negocio exitentte: ", negocioExiste);
        
        //creacion de factura
        const factura = new facturaSchema({
            id: facturaId,
            negocioId: negocioId,
            negocioNombre: negocioNombre,
            fecha: fecha,
            negocioId: negocioId,
            negocioNombre: negocioNombre,
            total: total,
        });
        console.log("check piont3 crear facturA: ", factura);
        await factura.save({ session: session });
        //guardar movimiento  
        await session.commitTransaction();
        res.status(201).json({ message: 'Factura creada' });
        


    } catch (err) {
        await session.abortTransaction();
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Factura ya existe' });
        }
        console.log("error: ", err);
        res.status(500).json({ error: "No se pudo crear la factura: " + err.message });
    } finally {
        session.endSession();
    }
}

function validacion(datos) {
    //validaciones de campos vacios o nulos 
    for (const propiedad in datos) {
        console.log("check piont de validacion: ", datos[propiedad] + ' posicion' + propiedad);
        if (datos[propiedad] == null || datos[propiedad] == undefined || datos[propiedad] == "" || datos[propiedad] == " ") {
            console.log("check piont de validacion: ", datos[propiedad] + ' posicion' + propiedad);
            return true 
        }
    } 
    return false;      
}


module.exports = { getFactura,getOneFactura,createFactura };