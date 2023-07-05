const { request } = require('express');
const productSchema = require('../models/product.schema');
const negocioSchema = require('../models/negocio.schema');
const bodegaSchema = require('../models/bodega.schema');

//get all Products
const getProduct = (req, res) => {
  try
  {productSchema
    .find({ activo: true }) // Agrega un filtro para activo=true
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get product by product_id
const getOneProduct = async(req, res) => { 
    try {
          const pid=req.params.producto_id;
          if(pid==null || pid==undefined || pid==""){
              res.status(500).json({ error: "El id es requerido" });
          }
          const producto_id = parserword(pid);
          //console.log('check point get oneproduct parserword',producto_id);
      
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
try {
  //obteniendo variables del body
  const { producto_id, precio_regular, precio_especial, familia_id,
    nombre,tipo } = req.body;
  const activo = true;
  let cantidadTotal = 0;
  
  //validando que se ingresen todos los datos
  if(producto_id==null || precio_regular==null || familia_id==null || nombre==null  ){
    return res.status(400).json({ message: "no se ingresaron datos",datos: req.body });
  }

  // //validando que no se ingrese un nombre de bodega que no existe (arreglo de bodegas)
  // if( bodegas !=undefined && bodegas.length > 0){
  //   for (let i = 0; i < bodegas.length; i++) {
  //     if(bodegas[i].nombreBodega===null || bodegas[i].bodegaId===null){
  //       return res.status(400).json({ message: "no se ingresaron datos de bodegas" });
  //     }
  //     const nombreBodegaParseado = bodegas[i].nombreBodega.toUpperCase().trim();
  //     bodegas[i] = {
  //       ...bodegas[i],
  //       nombreBodega: nombreBodegaParseado
  //     }
  //     const bodegaExistente = await bodegaSchema.findOne({ bodegaNombre: nombreBodegaParseado });
  //     if (bodegaExistente === null || bodegaExistente === undefined) {
  //       return res.status(400).json({ message: `La bodega ${bodegas[i].nombreBodega} no existe en la empresa.` });
  //     }
  //     cantidadTotal = cantidadTotal + bodegas[i].cantidad;
  //   }
  // }

  //validando que no se ingrese un precio especial sin cliente o con un cliente que no existe (arreglo de precios especiales)
  if(precio_especial !=undefined && precio_especial.length > 0){
    for (let i = 0; i < precio_especial.length; i++) {
      if(!precio_especial[i].cliente_id){
        return res.status(400).json({ message: "no se ingresaron datos de clientes" });
      }
      const clienteExistente = await negocioSchema.findOne({ id: precio_especial[i].cliente_id });
      if (clienteExistente === null || clienteExistente === undefined) {
        return res.status(400).json({ message: `El cliente ${precio_especial[i].cliente_id} no existe en la empresa.` });
      }
    }
  }

    const product_id_parseado= producto_id.toUpperCase().trim();
    const nombre_parseado = nombre.toUpperCase().trim();
    console.log("creando producto... antes del schema")
    const product = productSchema({
      producto_id: product_id_parseado,
      precio_regular,
      precio_especial,
      familia_id,
      activo,
      nombre: nombre_parseado,
      cantidadTotal,
      tipo
    });
    
    await product.save();
    res.send("producto creado: " + product)
  } catch (error) {

    console.log(error.message)
    // Si ocurre un error, lánzalo para que sea manejado por el llamador de la función
    res.status(400).json({ message: error.message });
  }
};

//delete product, change active to false, not delete from database 
const deleteProduct = (req, res) => {
  const producto_id = parserword(req.params.producto_id);
  //console.log('checkpoint deleteproduct' +producto_id);
  try {

    if (producto_id==null || producto_id==undefined || producto_id=="" || producto_id==" " || producto_id=="  " ) {
      res.status(400).json({ message: 'No se proporcionó el ID del producto' });
    }
    if (producto_id) {
      productSchema
        .updateOne({ producto_id: producto_id }, { $set: { activo: false } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar la función updateProduct
const updateProduct = async (req, res) => {
  try {
    const producto_id=parserword(req.params.producto_id);
    const { nombre, precio_regular, precio_especial, familia_id } = req.body;

    // Validar que al menos uno de los parámetros está presente
    if (!nombre && !precio_regular && !precio_especial && !familia_id ) {
      return res.status(400).json({ message: 'Al menos un parámetro debe ser enviado.' });
    }

    //evaluar que exista el producto
    const producto = await productSchema.findOne({ producto_id: producto_id });
    if (!producto) {
      throw new Error(`El producto ${producto_id} no existe`);
    }


    //validando que no se ingrese un precio especial sin cliente o con un cliente que no existe
    if(precio_especial !=undefined){
      for (let i = 0; i < precio_especial.length; i++) {
        if(!precio_especial[i].cliente_id){
          return res.status(400).json({ message: "no se ingresaron datos de clientes" });
        }
        const clienteExistente = await negocioSchema.findOne({ id: precio_especial[i].cliente_id });
        if (clienteExistente === null || clienteExistente === undefined) {
          return res.status(400).json({ message: `El cliente ${precio_especial[i].cliente_id} no existe en la empresa.` });
        }
      }
    }

    //actualizar producto
    const productoActualizado = await productSchema.findOneAndUpdate(
      { producto_id: producto_id },
      {
        $set: {
          nombre,
          precio_regular,
          precio_especial,
          familia_id
        },
      },
      { new: true } // Devolver el producto actualizado en lugar del original
    );
    if (productoActualizado) {
      res.json({productoactualizado: productoActualizado});
    } else {
      res.status(404).json({ message: 'Producto no encontrado', producto_id });
    }
  } catch (error) {
    res.status(400).json({ message2: error.message });
  }
};



  //funcion para actualizar el precio de un producto para un cliente
  const updatePrecioProducto = async (req, res) => {
    try {
      const { producto_id } = req.params;
      const { cliente_id, precio } = req.body;
      const producto = await productSchema.findOne({ producto_id: producto_id });
      console.log("checkpoint 1",producto);
      if (!producto) {
        throw new Error(`El producto ${producto_id} no existe`);
      }
  
      const isInPrecioEspecial = await productSchema.findOne({ producto_id: producto_id, "precio_especial.cliente_id": cliente_id });
  
      if (!isInPrecioEspecial) {
        // Agregar el cliente y el precio especial
        await productSchema.findOneAndUpdate(
          { producto_id: producto_id },
          {
            $push: {
              precio_especial: {
                cliente_id: cliente_id,
                precio: precio
              }
            }
          }
        );
        res.json({ message: 'Cliente y precio especial agregados' });
      } else {
        await productSchema.findOneAndUpdate(
          { producto_id: producto_id, "precio_especial.cliente_id": cliente_id },
          {
            $set: {
              "precio_especial.$.precio": precio
            }
          }
        );
        res.json({ message: 'Precio actualizado' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  //funcion para actualizar el precio de un producto y actualizar el precio especial de todos los clientes
  const updatePrecioProductoTodos = async (req, res) => {
    try {
      const { producto_id } = req.params;
      const { precio } = req.body;
  
      const producto = await productSchema.findOne({ producto_id: producto_id });
      console.log("checkpoint 1", producto);
  
      if (!producto) {
        throw new Error(`El producto ${producto_id} no existe`);
      }
  
      const diferencia = precio - producto.precio_regular;
      producto.precio_regular = precio;
  
      producto.precio_especial = producto.precio_especial.map((precio_especial) => {
        return {
          ...precio_especial,
          precio: precio_especial.precio + diferencia,
        };
      });
  
      await producto.save();
  
      res.status(200).json({ message: "Precio general y especiales del producto " + producto_id+" actualizados con éxito", producto });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  

//funcion para parsear una palabra(quita espacios y pone en mayus todo)
const parserword = (word) => {
  return word.toUpperCase().trim();
};
  
module.exports = {getProduct,createProduct,deleteProduct,getOneProduct,updateProduct,updatePrecioProducto,updatePrecioProductoTodos};