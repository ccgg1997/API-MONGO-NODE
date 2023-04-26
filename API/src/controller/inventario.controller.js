const { request } = require('express');
const inventarioSchema = require('../models/inventario.schema');
const jwt = require('jsonwebtoken');

//get inventario
const getInventario = async (req, res) => {
    try {
      const data = await inventarioSchema.find({ activo: true });
      res.json(data);
    } catch (error) {
      res.json({ message: error });
    }
  };

const getOneInventario = async (req, res) => {
    try {
    const { producto_id } = req.params;
    const data = await inventarioSchema.findOne({ producto_id, activo: true });
    if (!data) {
        return res.status(404).json({ message: "No se encontró ningún inventario con ese ID de producto." });
    }
    res.json(data);
    } catch (error) {
    res.json({ message: error });
    }
};


// Crear nuevo inventario
const createInventario= async(req, res) =>{
 
  try {
    //const {  productoId, cantidadTotal, bodegas } = req.body;
    const codProducto = req.body.codProducto;
    const productoId = req.body.productoId;
    const cantidadTotal = req.body.cantidadTotal;
    const bodegas = req.body.bodegas;
    // Crear nuevo registro de inventario
    const activo= true;
    const nuevoInventario = inventarioSchema({
      codProducto,
      productoId,
      cantidadTotal,
      bodegas,
      activo
    });
    console.log("nuevoinvetarrio:",nuevoInventario, "codigo pructo:" , codProducto, productoId, cantidadTotal, bodegas, activo);

    // Guardar registro en la base de datos
    await nuevoInventario.save();

    res.status(201).json({ message: 'Inventario creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear inventario' });
  }
};

  module.exports = {getInventario,getOneInventario,createInventario};