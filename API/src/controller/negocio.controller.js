const { request } = require('express');
const Negocio = require('../models/negocio.schema');
const negocioSchema = require('../models/negocio.schema');

//create negocio
const createNegocio = async (req, res) => {
  try {
    const { id, negocio, duenio, telefono, direccion, barrio,ultimoPedido,ultimaLlamada } = req.body;
    const Negocio = negocioSchema({
      id,
      negocio,
      duenio,
      telefono,
      direccion,
      barrio,
      ultimoPedido,
      ultimaLlamada
    });

    const negocioSaved = await Negocio.save();
    res.status(200).json("negocio agregado " + negocioSaved);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

//obtener todos los negocios
const getNegocio = async (req, res) => {
  try {
    const negocio = await Negocio.find();
    res.json(negocio);
  } catch (error) {
    res.json({ message: error });
  }
}
//obtener un negocio
const getOneNegocio = async (req, res) => {
  const { id } = req.params;
  try {
    negocioSchema
      .findOne({ id: id })
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.status(404).json({ message: 'id no existe', id: id });
        }
      })
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//actualizar un negocio
const updateNegocio = async (req, res) => {
  const { id } = req.params;
  const { negocio, duenio, telefono, direccion, barrio, ultimoPedido, ultimaLlamada } = req.body;
    negocioSchema
      .updateOne({ id: id }, { $set:{ negocio,duenio,telefono,direccion,barrio,ultimoPedido,ultimaLlamada }})
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));

}

//eliminar un negocio
const deleteNegocio = async (req, res) => {
  const { id } = req.params;
  negocioSchema
    .updateOne({id:id},{$set: {active:false}})
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}))
}

module.exports = { createNegocio, getNegocio, getOneNegocio, updateNegocio, deleteNegocio };
