const { request } = require('express');
const bodegaSchema = require('../models/bodega.schema');

//get inventario
const getBodega = async (req, res) => {
    try {
      const data = await bodegaSchema.find({ activo: true });
      res.json(data);
    } catch (error) {
      res.json({ message: error });
    }
  };

//get one bodega, retorna 1 bodega por id
const getOneBodega = async (req, res) => {
    try {
    const bodegaId  = parserword(req.params.bodegaId);
    console.log("checkpoint getonebodega:: ", bodegaId);
    const data = await bodegaSchema.findOne({bodegaId:bodegaId});
    if (!data) {
        return res.status(404).json({ message: "No se encontró ningún Bodega con ese ID de bodega." });
    }
    res.json(data);
    } catch (error) {
    res.json({ message: error });
    }
};

// Crear nuevo Bodega
const createBodega = async (req, res) => {
  const  bodegaId = parserword(req.body.bodegaId);
  const bodegaNombre = parserword(req.body.bodegaNombre);

  // Validar que se proporcionó un nombre de bodega
  if (!bodegaNombre) {
      return res.status(400).json({ message: "No se proporcionó un nombre de bodega" });
  }
  try {
      // Crear nuevo registro de Bodega
      const nuevaBodega = bodegaSchema({
          bodegaId,
          bodegaNombre: bodegaNombre
      });

      // Guardar registro en la base de datos
      await nuevaBodega.save();

      res.status(201).json({ message: 'Bodega creado exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear Bodega' });
  }
};

  

// const updateBodega = async (req, res) => {
//   try {
//     const { bodegaId } = req.params;
//     const { activo } = req.body;
//     console.log("checkpoint updateBodega:: ", bodegaId, cantidadTotal, cantidadProducto, activo);

//     // Validar que al menos uno de los parámetros está presente
//     if (!cantidadTotal && !cantidadProducto && activo === undefined) {
//       return res.status(400).json({ message: 'Al menos un parámetro debe ser enviado.' });
//     }

//     const updatedBodega = await bodegaSchema.findOneAndUpdate(
//       { bodegaId: bodegaId },
//       { $set: { cantidadTotal:cantidadTotal, cantidadProducto:cantidadProducto, activo:activo } },
//       { new: true } // Devolver la bodega actualizada en lugar de la original
//     );

//     if (updatedBodega) {
//       res.json(updatedBodega);
//     } else {
//       res.status(404).json({ message: 'id no existe', bodegaId: bodegaId });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
  


const deleteBodega = async (req, res) => {
    try {
        const bodegaId  = parserword(req.params.bodegaId);
        console.log("checkpoint delete:: ", bodegaId);
        const data = await bodegaSchema.findOneAndUpdate({ bodegaId: bodegaId },
          { $set: {activo:false } },
          { new: true }) // Devolver la bodega actualizada en lugar de la original);
        if (!data) {
            return res.status(404).json({ message: "No se encontró ningún Bodega con ese ID de bodega." });
        }
        res.json(data);
    } catch (error) {
        res.json({ message: error });
    }
};

//funcion para parsear una palabra(quita espacios y pone en mayus todo)
const parserword = (word) => {
  return word.toUpperCase().trim();
};

  module.exports = {getBodega,getOneBodega,createBodega,deleteBodega};