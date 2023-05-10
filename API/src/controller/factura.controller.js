const { request } = require('express');
const movimientoSchema = require('../models/movimiento.schema');
const facturaSchema = require('../models/factura.schema');
const detalleSchema = require('../models/detalleFactura.schema');
const negocioSchema = require('../models/negocio.schema');
const productoSchema = require('../models/product.schema');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const config = require('../config');

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
        const { negocioId, total,productos, facturaId } = req.body;
        const fecha = new Date(moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss'));

        //extrayendo el usuario del token
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded.idUser;
        const name=decoded.name;
        const usuario= userId+"-"+name;

        //validar datos
        if(validacion( [negocioId, total,productos, facturaId])){
            return res.status(400).json({ message: 'Faltan datos o datos incorrectos' });
        }

        //validacion que negocio existe
        const negocioExiste= await negocioSchema.findOne({ id: negocioId });
        if (validacion([negocioExiste])) {
            return res.status(400).json({ message: 'Negocio no existe, ingrese negocio valido para la factura' })
        }

        const negocioNombre = negocioExiste.negocio;

        console.log("check piont1 de negocio exitentte: ", negocioExiste,'nombre:negocio', negocioNombre);

        //validacion de detalle de productos
        for(let i=0; i<productos.length; i++){
            
            //validacion de que no este vacio el producto id
            if(validacion([productos[i].productoId])){
            return res.status(400).json({ message: 'datos incompletos en producto' })}

            // verificacion que producto id existe en la base de datos
            const productoExiste= await productoSchema.findOne({ producto_id: productos[i].productoId});
            if (validacion([productoExiste])) {
                return res.status(400).json({ message: 'Producto no existe, ingrese producto valido para la factura' })
            }

            //validacion de cantidad del producto no sea menor a 0
            if(validacion([productos[i].cantidad])|| productos[i].cantidad <= 0){
            return res.status(400).json({ message: 'Falta cantidad de producto'+productos[i].productoId })}

            //validacion de que no este vacia la familia
            if(validacion([productos[i].familia]) ){
            return res.status(400).json({ message: 'Falta familia de producto'+productos[i].productoId })}
            const cantidad = productos[i].cantidad;
            const detalleProducto = new detalleSchema({
                facturaId: facturaId,
                productoId: productos[i].productoId,
                productoNombre: productoExiste.nombre,
                cantidad: cantidad,
                precio:  productos[i].precio,
                familia: productos[i].familia,
                fecha: fecha,
                detalle: productos[i].detalle,
                
            });
            console.log("check piont2 de detalle: ", detalleProducto);
            await detalleProducto.save({ session: session });

            //crear movimmiento de bodega para cada producto
            const newMovimiento = new movimientoSchema({ tipo:'salida', fecha:fecha, cantidad:cantidad, productoId: productos[i].productoId, bodegaId:'E03',usuario,categoria:'venta' }); 
            await newMovimiento.save({ session: session });

            console.log( "check piont3 de actualizar valor de inventarioProducto: ",'productoId: ',productos[i].productoId, 'cantidad:',cantidad);
            //actualizar cantidad de producto en bodega
            await productoSchema.findOneAndUpdate(
                { producto_id: productos[i].productoId, "bodegas.bodegaId": 'E03' },
                { $inc: { "bodegas.$.cantidad": -cantidad, cantidadTotal: -cantidad } },
                { session });
        }
        
        //creacion de factura
        const factura = new facturaSchema({
            id: facturaId,
            negocioId: negocioId,
            negocioNombre: negocioNombre,
            fecha: fecha,
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