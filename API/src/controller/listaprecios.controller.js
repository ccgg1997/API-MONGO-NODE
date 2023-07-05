const { request } = require('express');
const productSchema = require('../models/product.schema');


//get all Products
const getListaPrecios = (req, res) => {
  try
  {productSchema
  .find({ activo: true, tipo: 'PRODUCTO' })
  .select('producto_id nombre precio_regular -_id')
  .then((data) => {
    const modifiedData = data.map((product) => {
      const { producto_id,precio_regular,nombre, ...rest } = product.toObject();
      return { product_id: producto_id, nombre, precio: precio_regular, ...rest };
    });

    res.json(modifiedData);
  })
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getListaPreciosIdCliente = (req, res) => {
  try {
    const clienteId = req.params.cliente_id; // Obtener el ID de los parámetros de la solicitud

    productSchema.find({ activo: true, tipo: 'PRODUCTO' })
      .select('producto_id nombre precio_regular precio_especial')
      .then((products) => {
        // Mapear los productos y ajustar los precios según la lógica requerida
        const data = products.map((product) => {
          const precioEspecial = product.precio_especial.find(
            (precio) => precio.cliente_id === clienteId
          );

          const precio = precioEspecial ? precioEspecial.precio : product.precio_regular;

          return {
            product_id: product.producto_id,
            nombre: product.nombre,
            precio: precio
          };
        });

        res.json(data);
      })
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {getListaPrecios,getListaPreciosIdCliente};