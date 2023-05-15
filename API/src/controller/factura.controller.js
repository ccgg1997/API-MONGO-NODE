const { request } = require('express');
const movimientoSchema = require('../models/movimiento.schema');
const facturaSchema = require('../models/factura.schema');
const detalleSchema = require('../models/detalleFactura.schema');
const negocioSchema = require('../models/negocio.schema');
const {createMovimientoFunction} = require('./movimiento.controller');
const productoSchema = require('../models/product.schema');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const config = require('../config');
const detalleFacturaSchema = require('../models/detalleFactura.schema');

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
        const { negocioId, total,productos, facturaId } = mayuscula(req.body);
        const fecha = new Date(moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss'));
        //extrayendo el usuario del token
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded.idUser;
        const name=decoded.name;
        const usuario= userId+"-"+name;

        //info
        //sacando ultima factura y pasando el serial a hexadecimal para la proxima factura
        const ultimaFactura = await facturaSchema.findOne().sort({ _id: -1 }).limit(1);
        const proximaFactura = ultimaFactura ? ultimaFactura.inc_field + 1 : 1;
        const hexa = proximaFactura.toString(16);

        //validar datos
        if(isEmpty( [negocioId, total,productos, facturaId])){
            return res.status(400).json({ message: 'Faltan datos o datos incorrectos' });
        }

        //isEmpty que negocio existe
        const negocioExiste= await negocioSchema.findOne({ id: negocioId });
        if (isEmpty([negocioExiste])) {
            return res.status(400).json({ message: 'Negocio no existe, ingrese negocio valido para la factura' })
        }

        const negocioNombre = negocioExiste.negocio;
        console.log("check piont1 de negocio exitentte: ", negocioExiste,'nombre:negocio', negocioNombre);

        //verificando informacion de productos
        for(let i=0; i<productos.length; i++){
            //isEmpty de que no este vacio el producto id
            if(isEmpty([productos[i].productoId])){
            return res.status(400).json({ message: 'datos incompletos en producto' })}
            // verificacion que producto id existe en la base de datos
            const productoExiste= await productoSchema.findOne({ producto_id: productos[i].productoId});
            if (isEmpty([productoExiste])) {
                return res.status(400).json({ message: 'Producto no existe, ingrese producto valido para la factura' })
            }
            //isEmpty de cantidad del producto no sea menor a 0
            if(isEmpty([productos[i].cantidad]) || productos[i].cantidad <= 0){
            return res.status(400).json({ message: 'Falta cantidad de producto'+productos[i].productoId })}
            //isEmpty de que no este vacia la familia
            if(isEmpty([productos[i].familia]) ){
            return res.status(400).json({ message: 'Falta familia de producto'+productos[i].productoId })}
            console.log("check piont1 de productos: checkeando productos", productos[i].productoId, productos[i].cantidad, productos[i].familia);
        }

        //creandomovimientos de bodegas por producto
        for(let i=0; i<productos.length; i++){
            //extrayendo datos de productos
            const cantidadProducto= productos[i].cantidad;
            const categoriaProducto= productos[i].familia;
            const productoIdProducto= productos[i].productoId;
            const estilos= productos[i].estilos;
            //datos para crear movimiento
            const datos = {cantidad:cantidadProducto,categoria: "VENTA", productoId:productoIdProducto, bodegaId:"E03", tipo:"SALIDA", estilos, usuario, factura:hexa};
            
            //lo que se manda a crear movimiento
            console.log('lo que se manda a crear inventario:', datos)

            //crear movimiento
            const movimientosCrear= await createMovimientoFunction(datos);
            if(!movimientosCrear){
                return res.status(400).json({ message: 'No se pudo crear movimiento de bodega, problema en los productos ingresados' })
            }
           
        }

        //ceckpoint
        console.log("check piont2 de productos: los productos no estan vacios ");
        console.log('estaaaaaaaaaaaamos en el hexa: ', hexa )

        //creacion de detalles de factura
        const detalleFactura = new detalleFacturaSchema({
            facturaId: hexa,
            productos: productos,
            fecha: fecha,
            
        });

        //creacion de factura
        const factura = new facturaSchema({
            id: "hola",
            negocioId: negocioId,
            negocioNombre: negocioNombre,
            fecha: fecha,
            total: total,
        });
        console.log("check piont3 crear facturA: ", factura);

        //guardar factura y detalle de factura
        await factura.save({ session: session });
        await detalleFactura.save({ session: session });

        //guardar movimiento  
        await session.commitTransaction();
        res.status(201).json({ message: 'Factura creada1' });
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

//funcion para eliminar factura
const deleteFactura = async (req, res) => {
    try {
        const id = req.params.id;
        if (id == null || id == undefined || id == "" || id == " ") {
            return res.status(400).json({ message: 'Falta el id' })
        };
        await facturaSchema.findOneAndUpdate({ id: id }, { activo: false });    
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

//Función para valir que los datos no esten vacios
function isEmpty(datos) {
    //isEmptyes de campos vacios o nulos 
    for (const propiedad in datos) {
        console.log("check piont de isEmpty: ", datos[propiedad] + ' posicion' + propiedad);
        if (datos[propiedad] == null || datos[propiedad] == undefined || datos[propiedad] == "" || datos[propiedad] == " ") {
            console.log("check piont de isEmpty: ", datos[propiedad] + ' posicion' + propiedad);
            return true 
        }
    } 
    return false;      
}

//pasar a mayuscula los datos
const mayuscula = (datos) => {
    const datosMayusculas = {};
    for (let key in datos) {
      if (typeof datos[key] === 'string') {
        datosMayusculas[key] = datos[key].toUpperCase();
      } else {
        datosMayusculas[key] = datos[key];
      }
    }
    return datosMayusculas;
  }

module.exports = { getFactura,getOneFactura,createFactura };