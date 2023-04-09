const { request } = require('express');
const productSchema = require('../models/product.schema');
const jwt = require('jsonwebtoken');

//get all Products
const getProduct = (req, res) => { 
    
    productSchema
        .find()
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}));
    //res.json({ message: ' agregado' });
};

//create product
const createProduct = async (req, res) => {
    const producto_id= req.body.producto_id;
    const precio_regular= req.body.precio_regular;
    const precio_especial= req.body.precio_especial ;
    const familia_id= req.body.familia_id ; 
    const activo = true;
    const nombre= req.body.nombre;

    try {
      // Crea un nuevo producto con los datos proporcionados
      const nuevoProducto = productSchema({
        producto_id,
        precio_regular,
        precio_especial,
        familia_id,
        activo,
        nombre
      });
      console.log(nuevoProducto ) ;
      
      //res.json({status:200, message: nuevoProducto});
      // Guarda el nuevo producto en la base de datos y espera a que se complete la operación
      await nuevoProducto.save();

      res.send("producto creado: " + nuevoProducto)
      
      
    } catch (error) {
      // Si ocurre un error, lánzalo para que sea manejado por el llamador de la función
        res.status(400).json({ message: error.message });
      //throw { status: 400, message: 'Error al crear el producto' };
      
      
    }
  };
  

module.exports = {getProduct,createProduct};