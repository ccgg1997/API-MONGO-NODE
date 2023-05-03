const { request } = require('express');
const productSchema = require('../models/product.schema');
const jwt = require('jsonwebtoken');

//get all Products
const getProduct = (req, res) => {
  productSchema
    .find({ activo: true }) // Agrega un filtro para activo=true
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
};

//get product by product_id
const getOneProduct = async(req, res) => { 
    const producto_id = req.params.producto_id;
    //console.log(producto_id);
    try {
        await productSchema
              .findOne({producto_id:producto_id})
              .then((data) => {
                  if (data) {
                      res.json(data);
                  } else {
                      res.status(404).json({message: 'id no existe', producto_id: producto_id});
                  }
              })
              .catch((error)=> res.json({message: error}));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//create product
const createProduct = async (req, res) => {
  const producto_id= req.body.producto_id;
  const precio_regular= req.body.precio_regular;
  const precio_especial= req.body.precio_especial ;
  const familia_id= req.body.familia_id ; 
  const activo = true;
  const nombre= req.body.nombre;
  const bodegas = req.body.bodegas;
  const cantidadTotal = req.body.cantidadTotal;

  try {
    // Crea un nuevo producto con los datos proporcionados
    console.log("creando producto... antes del schema")
    const product = productSchema({
      producto_id,
      precio_regular,
      precio_especial,
      familia_id,
      activo,
      nombre,
      bodegas,
      cantidadTotal
    });
    
    await product.save();
    res.send("producto creado: " + productSchema)
  } catch (error) {

    console.log(error.message)
    // Si ocurre un error, lánzalo para que sea manejado por el llamador de la función
    res.status(400).json({ message: error.message });
  }
};



  //delete product, change active to false, not delete from database 
  const deleteProduct = (req, res) => {
    const producto_id = req.params.producto_id;
    console.log(producto_id);
    try {
      if (producto_id) {
        productSchema
          .updateOne({ producto_id: producto_id }, { $set: { activo: false } })
          .then((data) => res.json(data))
          .catch((error) => res.json({ message: error }));
      }
      if (!producto_id) {
        res.status(400).json({ message: 'No se proporcionó el ID del producto' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


// Actualizar la función updateProduct
const updateProduct = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const { nombre, precio_regular, precio_especial, familia_id } = req.body;

    // Validar que al menos uno de los parámetros está presente
    if (!nombre && !precio_regular && !precio_especial && !familia_id && !cantidadTotal) {
      return res.status(400).json({ message: 'Al menos un parámetro debe ser enviado.' });
    }

    // Validar que el producto existe
    const productoActualizado = await productSchema.findOneAndUpdate(
      { producto_id: producto_id },
      {
        $set: {
          nombre,
          precio_regular,
          precio_especial,
          familia_id,
        },
      },
      { new: true } // Devolver el producto actualizado en lugar del original
    );

    if (productoActualizado) {
      res.json(productoActualizado);
    } else {
      res.status(404).json({ message: 'Producto no encontrado', producto_id });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  
  
  
  

module.exports = {getProduct,createProduct,deleteProduct,getOneProduct,updateProduct};