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
    nombre } = req.body;
  const activo = true;
  let cantidadTotal = 0;
  
  //validando que se ingresen todos los datos
  if(producto_id==null || precio_regular==null || familia_id==null || nombre==null  ){
    return res.status(400).json({ message: "no se ingresaron datos" });
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
      cantidadTotal
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
    const { nombre, precio_regular, precio_especial, familia_id,bodegas,cantidadTotal } = req.body;

    // Validar que al menos uno de los parámetros está presente
    if (!nombre && !precio_regular && !precio_especial && !familia_id && !cantidadTotal && !bodegas) {
      return res.status(400).json({ message: 'Al menos un parámetro debe ser enviado.' });
    }

    //evaluar que exista el producto
    const producto = await productSchema.findOne({ producto_id: producto_id });
    if (!producto) {
      throw new Error(`El producto ${producto_id} no existe`);
    }

    //validando que no se ingrese un nombre de bodega que no existe
    if( bodegas !=undefined && bodegas.length > 0){
      for (let i = 0; i < bodegas.length; i++) {
        if(!bodegas[i].nombreBodega){
          return res.status(400).json({ message: "no se ingresaron datos de bodegas" });
        }
        const nombreBodegaParseado = bodegas[i].nombreBodega.toUpperCase().trim();
        bodegas[i] = {
          ...bodegas[i],
          nombreBodega: nombreBodegaParseado
        }
        const bodegaExistente = await bodegaSchema.findOne({ bodegaNombre: nombreBodegaParseado });
        if (bodegaExistente === null || bodegaExistente === undefined) {
          return res.status(400).json({ message: `La bodega ${bodegas[i].nombreBodega} no existe en la empresa.` });
        }
      }
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
          familia_id,
          bodegas
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

//funcion para actualizar la cantidad de un producto en una bodega
const updateProductBodega = async (req, res) => {
  try {
    //tomar variables del body y params
    const { producto_id } = req.params;
    const { bodega,cantidad } = req.body;

    //validar que se ingresen todos los datos
    if(bodega===undefined || producto_id===null || cantidad===""){
      throw new Error("No se ingresó informacion completa");
    }

    //parsear nombre bodega
    const nombreBodegaParseado = bodega.toUpperCase().trim();

    //evaluar que exista el producto
    const producto_idParseado = producto_id.toUpperCase().trim();
    const producto = await productSchema.findOne({ producto_id: producto_idParseado});
    if (!producto) {
      throw new Error(`El producto ${producto_id} no existe`);
    }
    console.log("check point 1",producto_idParseado,bodega, cantidad,producto);
    

    //evaluar que exista la bodega
    const isInBodega = await bodegaSchema.findOne({ bodegaNombre: nombreBodegaParseado});
    if (isInBodega===null || isInBodega===undefined) {
      throw new Error(`La bodega ${bodega} no existe para el producto ${producto_id}`);
    }
    console.log("check point 2",producto_idParseado,nombreBodegaParseado, isInBodega);
    
    //cantidad vieja bodega
    const cantidadBodegaEA01 = producto.bodegas.reduce((total, bodega) => {
      return bodega.bodegaId === 'EA01' ? total + bodega.cantidad : total;
    }, 0);
    const cantidadBodegaVieja = cantidadBodegaEA01;
    console.log("check point 2.1 bodega vieja",cantidadBodegaVieja, 'cantidad total vieja', producto.cantidadTotal);

    //cantidad total nueva
    const cantidadTotalNueva= (producto.cantidadTotal - cantidadBodegaVieja) + cantidad;

    //hacer cambios en la bodega
    const productoActualizado=await productSchema.findOneAndUpdate(
      { producto_id: producto_idParseado, "bodegas.nombreBodega": nombreBodegaParseado},
      {
        $set: {
          "bodegas.$.cantidad": cantidad, "cantidadTotal": cantidadTotalNueva
        },
      },
    );

    if(!productoActualizado){
      throw new Error(`El producto ${producto_id} se pudo actualizar en la bodega ${bodega}`);
    }
    console.log("check point 3",productoActualizado);
    res.json({ message: 'Bodega actualizada' });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  };

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
      throw new Error(`El cliente ${cliente_id} no tiene precios especiales de ${producto_id}`);
    }

    await productSchema.findOneAndUpdate(
      { producto_id: producto_id, "precio_especial.cliente_id": cliente_id},
      {
        $set: {
          "precio_especial.$.precio": precio,
        },
      },
    );
    res.json({ message: 'precio actualizado' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//funcion para parsear una palabra(quita espacios y pone en mayus todo)
const parserword = (word) => {
  return word.toUpperCase().trim();
};
  
module.exports = {getProduct,createProduct,deleteProduct,getOneProduct,updateProduct,updateProductBodega,updatePrecioProducto};