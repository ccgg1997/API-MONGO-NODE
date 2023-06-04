const { request } = require('express');
const Negocio = require('../models/negocio.schema');
const moment = require('moment-timezone');
const negocioSchema = require('../models/negocio.schema');

//create negocio
const createNegocio = async (req, res) => {
  try {
    const { id, negocio, duenio, telefono, direccion, barrio } = req.body;
    if(id == null || negocio == null || duenio == null || telefono == null || direccion == null || barrio == null){
      return res.status(400).json({message:"Faltan datos por llenar"});
    }
    const ultimoPedido = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const ultimaLlamada = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
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
    const negocio = await Negocio.find({active:true}, { active: 0, __v: 0, _id:0 } );
    res.json(negocio);
  } catch (error) {
    res.json({ message: error });
  }
}
//obtener un negocio
const getOneNegocio = async (req, res) => {
  try {
    const { id } = req.params;
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
  try{
  //tomar datos de id
  const { id } = req.params;
  if (id===null || id===undefined || id==="" || id===" " || isNaN(id)) {
    return res.status(400).json({ message: 'No se proporcionó un id' });
  }
  const negocioFound = await negocioSchema.findOne({ id: id });
  if (negocioFound===null || negocioFound===undefined  ) {
    return res.status(400).json({ message: 'No se encontró el negocio' });
  }

  //tomar datos de body
  const { negocio, duenio, telefono, direccion, barrio, ultimoPedido, ultimaLlamada } = req.body;
  if(negocio == null && duenio == null && telefono == null && direccion == null && barrio == null && ultimoPedido == null && ultimaLlamada == null){
    return res.status(400).json({message:"no hay datos que actualizar"});
  }
    negocioSchema
      .updateOne({ id: id }, { $set:{ negocio,duenio,telefono,direccion,barrio,ultimoPedido,ultimaLlamada }})
      .then((data) => res.json({message :"Negocio Actualizado con exito"}))
      .catch((error) => res.json({ message: error }));
  }catch(error){
    res.status(400).json({message:error.message});
  }
}

//eliminar un negocio
const deleteNegocio = async (req, res) => {
  try{
  const id  = req.params.id;
  console.log('id',id);
  if (id===null || id===undefined || id==="" || id===" " || isNaN(id)) {
    return res.status(400).json({ message: 'No se proporcionó un id' });
  }
  negocioSchema
    .updateOne({id:id},{$set: {active:false}})
    .then((data) => res.json({message:"Negocio eliminado con exito"}))
    .catch((error) => res.json({message:error}))
  }catch(error){
    res.status(400).json({message:error.message});
  }
}

module.exports = { createNegocio, getNegocio, getOneNegocio, updateNegocio, deleteNegocio };
