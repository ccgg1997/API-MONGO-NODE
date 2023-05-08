const { request } = require('express');
const movimientoSchema = require('../models/movimiento.schema');
const productoSchema = require('../models/product.schema');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const moment = require('moment-timezone');


// Función para obtener todos los movimientos
async function getMovimiento(req, res) {
  try {
    const movimientos = await movimientoSchema.find();
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Función para obtener un movimiento
const getOneMovimiento = async (req, res) => {
  try {
    const id =req.params.id;
    if(id==null || id==undefined || id=="" || id==" ") {
      return res.status(400).json({ message: 'Falta el id' } )
    };
    const movimiento = await movimientoSchema.findOne({_id:id});
    if (!movimiento) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) { 
    console.log(err);
    res.status(500).json({ error: err.message });
  }

};

//funcion para crear un movimiento
const createMovimiento = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { cantidad,categoria } = req.body;
    const tipo1= parserword(req.body.tipo);
    //valdiacion
    if(tipo1==null || cantidad==null || categoria==null){
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const tipo = tipo1.toLowerCase() ;

    //formato de datos
    fecha = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const productoId = parserword(req.body.productoId);
    const bodegaId = parserword(req.body.bodegaId);
    

    //extrayendo el usuario del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name=decoded.name;
    const usuario= userId+"-"+name;

    //schema de movimiento
    const newMovimiento = new movimientoSchema({ tipo, fecha, cantidad, productoId, bodegaId,usuario,categoria });
    
    // Buscar el producto y la bodega en la base de datos
    const producto = await productoSchema.findOne({ producto_id: productoId });
    if (!producto) {
      throw new Error(`El producto ${productoId} no existe`);
    }
    const bodega = await producto.bodegas.find((b) => b.bodegaId === bodegaId);
    console.log('bodega:', bodega, 'producto ', producto );
    if (!bodega) {
      throw new Error(`El id de la bodega ${bodegaId} no existe para el producto ${productoId}`);
    }

    //actualizar cantidad en producto
    await productoSchema.findOneAndUpdate(
      { producto_id: productoId, "bodegas.bodegaId": bodegaId },
      { $inc: { "bodegas.$.cantidad": tipo === 'entrada' ? cantidad : -cantidad, cantidadTotal: tipo === 'entrada' ? cantidad : -cantidad } },
      { session }
    );
    
    //guardar movimiento
    await newMovimiento.save({ session });
    await session.commitTransaction();
    res.json({ message: 'Movimiento creado' });

  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(500).json({ error: "No se pudo crear el movimiento: " + err.message });
  } finally {
    session.endSession();
  }
};

//funcion para crear un movimiento entre bodegas (ejemplo: surtir bodega 3 con la cantidad de bodega 1)
const createMovEntreBodegas = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    //traer datos de body
    const {productoId, bodegaId1, bodegaId2, cantidad } = req.body;

    //validacion de datos
    if(productoId===undefined || bodegaId1===undefined || bodegaId2===undefined || cantidad===undefined){
      console.log(productoId,bodegaId1,bodegaId2,cantidad);
      throw new Error(`Faltan datos, revise el productoId, bodegaId1, bodegaId2 y cantidad`);
    }

    //formato de datos
    const fecha = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const productoIdParseado = parserword(req.body.productoId);
    const bodegaId1Parseado = parserword(req.body.bodegaId1);
    const bodegaId2Parseado = parserword(req.body.bodegaId2);
    
    //validacion de datos
    if(bodegaId1Parseado===bodegaId2Parseado){
      throw new Error(`Las bodegas no pueden ser iguales`);
    }
    if(cantidad<=0){
      throw new Error(`La cantidad debe ser mayor a 0`);
    }
   
    //extrayendo el usuario del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name=decoded.name;
    const usuario= userId+"-"+name;

    //schema de movimiento de entrada
    const newMovimiento1 = new movimientoSchema({ tipo: 'entrada', fecha, cantidad, productoId: productoIdParseado, bodegaId: bodegaId2Parseado,usuario,categoria:'surtidoEntreBodega' });

    //schema de movimiento de salida
    const newMovimiento2 = new movimientoSchema({ tipo: 'salida', fecha, cantidad, productoId: productoIdParseado, bodegaId: bodegaId1,usuario,categoria:'surtidoEntreBodega' });

    // Buscar el producto 
    const producto = await productoSchema.findOne({ producto_id: productoIdParseado });
    if (!producto) {
       throw new Error(`El producto ${productoIdParseado} no existe`);
    }

    // Buscar que existan las bodegas en la base de datos
    const bodegaSalida = await producto.bodegas.find((b) => b.bodegaId === bodegaId1Parseado);
    console.log(bodegaId1Parseado,);
    if (!bodegaSalida) {
      throw new Error(`El id para la bodega de salida '${bodegaId1Parseado}' no existe para el producto ${productoIdParseado}`);
    }
    const bodegaentrada = await producto.bodegas.find((b) => b.bodegaId === bodegaId2Parseado);
    if (!bodegaentrada) {
      throw new Error(`El id para la bodega de entrada  '${bodegaId2Parseado}' no existe para el producto ${productoIdParseado}`);
    }

    //validar que la cantidad a surtir no sea mayor a la cantidad de la bodega de salida
    if (bodegaSalida.cantidad < cantidad) {
      throw new Error(`La cantidad a surtir es mayor a la cantidad de la bodega de salida`);
    }

    //actualizar cantidad de bodega de salida (restar cantidad)
    await productoSchema.findOneAndUpdate(
      { producto_id: productoIdParseado, "bodegas.bodegaId": bodegaId1Parseado },
      { $inc: { "bodegas.$.cantidad":-cantidad } },
      { session }
    );

    //actualizar cantidad de bodega de entrada (sumar cantidad)
    await productoSchema.findOneAndUpdate(
      { producto_id: productoId, "bodegas.bodegaId": bodegaId2Parseado },
      { $inc: { "bodegas.$.cantidad": cantidad } },
      { session }
    );

    //crear movimiento de entrada
    await newMovimiento1.save({ session });

    //crear movimiento de salida
    await newMovimiento2.save({ session });

    //guardar movimiento  
    await session.commitTransaction();
    res.json({ message: 'Movimiento creado' });


  }
  catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: "No se pudo crear el movimiento: " + err.message });
  } finally {
    session.endSession();
  }

};

//funcion para elminar movimiento por id
const deleteMovimiento = async (req, res) => {
  try {
    //verificar que el id no sea nulo
    const id =req.params.id;
    if(id==null || id==undefined || id=="" || id==" ") {
      return res.status(400).json({ message: 'Falta el id' } )
    };

    //formato de datos de fecha
    const fecha = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const movimiento = await movimientoSchema.findOneAndUpdate({_id:id}, { $set:{activo: false,fechaEliminacion:fecha,categoria:'devolucion'}});

    //actualiza la cantidad del producto con el movimiento eliminado(entrada o salida)
    const tipo=movimiento.tipo;
    const cantidad=movimiento.cantidad;
    const bodegaId=movimiento.bodegaId;
    const productoId=movimiento.productoId;
    
    if (!movimiento || !movimiento.activo ) return res.status(404).json({ message: 'Movimiento no encontrado o inactivo' });
    console.log('check point movimiento:',cantidad, tipo, bodegaId, productoId);
    console.log(movimiento);
    
    const productoModificado= await productoSchema.findOneAndUpdate(
      { producto_id: productoId, "bodegas.bodegaId": bodegaId },
      { $inc: { "bodegas.$.cantidad": tipo === 'salida' ? cantidad : -cantidad, cantidadTotal: tipo === 'salida' ? cantidad : -cantidad } });
    console.log('producto-modificado: '+productoModificado);

    res.json({ message: 'Movimiento eliminado' });
    
  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: err.message });
  }
};

//funcion para parsear una palabra(quita espacios y pone en mayus todo)
const parserword = (word) => {
  return word.toUpperCase().trim();
};


module.exports = {

  getMovimiento, getOneMovimiento,createMovimiento,deleteMovimiento,createMovEntreBodegas
 
};
