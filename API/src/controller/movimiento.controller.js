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
    const movimiento = await movimientoSchema.findOne({id:req.params.id});
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
    let { tipo, cantidad, productoId, bodegaId } = req.body;
    //formato de datos
    fecha = new Date();
    productoId = productoId.toUpperCase().trim();
    bodegaId = bodegaId.toUpperCase().trim();
    tipo=tipo.toLowerCase().trim();

    //extrayendo el usuario del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name=decoded.name;

    const usuario= userId+"-"+name;

    //schema de movimiento
    const newMovimiento = new movimientoSchema({ tipo, fecha, cantidad, productoId, bodegaId,usuario });
    

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


  



module.exports = {

  getMovimiento, getOneMovimiento,createMovimiento
 
};
