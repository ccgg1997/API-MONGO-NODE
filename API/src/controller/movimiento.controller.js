const { request } = require('express');
const movimientoSchema = require('../models/movimiento.schema');
const productoSchema = require('../models/product.schema');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');


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
    const movimiento = await movimientoSchema.findOne({_id:req.params.id});
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
    const { tipo, cantidad,categoria } = req.body;
    //formato de datos
    fecha = new Date();
    const productoId = parserword(req.body.productoId);
    const bodegaId = parserword(req.body.bodegaId);
    tipo=tipo.toLowerCase().trim();

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
    const bodega = producto.bodegas.find((b) => b.nombreBodega === bodegaId);
    if (!bodega) {
      throw new Error(`La bodega ${bodegaId} no existe para el producto ${productoId}`);
    }

    await productoSchema.findOneAndUpdate(
      { producto_id: productoId, "bodegas.nombreBodega": bodegaId },
      { $inc: { "bodegas.$.cantidad": tipo === 'entrada' ? cantidad : -cantidad, cantidadTotal: tipo === 'entrada' ? cantidad : -cantidad } },
      { session }
    );
    
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

//funcion para elminar movimiento por id
const deleteMovimiento = async (req, res) => {
  try {
    //elimna movimiento(cambia estado a false)
    const fecha = new Date();
    if(!req.params.id) return res.status(400).json({ message: 'Falta el id del movimiento' });
    const id=req.params.id
    const movimiento = await movimientoSchema.findOneAndUpdate({_id:id}, { $set:{activo: false,fechaEliminacion:fecha,categoria:'devolucion'}});

    //actualiza la cantidad del producto con el movimiento eliminado(entrada o salida)
    const tipo=movimiento.tipo;
    const cantidad=movimiento.cantidad;
    const bodegaId=movimiento.bodegaId;
    const productoId=movimiento.productoId;
    
    if (!movimiento || !movimiento.activo ) return res.status(404).json({ message: 'Movimiento no encontrado o inactivo' });
    //console.log(cantidad, tipo, bodegaId, productoId);
    //console.log(movimiento);
    
    const productoModificado= await productoSchema.findOneAndUpdate(
      { producto_id: productoId, "bodegas.nombreBodega": bodegaId },
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

  getMovimiento, getOneMovimiento,createMovimiento,deleteMovimiento
 
};
