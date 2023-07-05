const { request } = require("express");
const Persona = require("../models/persona.schema");
const moment = require("moment-timezone");

const getPersona = async (req, res) => {
  try {
    const personas = await Persona.find(
      { activo: true },
      { __v: 0, fechaEliminacion: 0, _id: 0 }
    );
    res.json(personas);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const createPersona = async (req, res) => {
  try {
    const { personaId, nombre, apellido, telefono, direccion, barrio } =
      req.body;
    console.log(req.body);
    const persona = new Persona({
      personaId,
      nombre,
      apellido,
      telefono,
      direccion,
      barrio,
    });
    await persona.save();
    res.send("persona creada: " + personaId);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const updatePersona = async (req, res) => {
  try {
    const { personaId } = req.params;
    const { nombre, apellido, telefono, direccion, barrio } = req.body;

    const updateFields = {
      nombre: nombre ? nombre : undefined,
      apellido: apellido ? apellido : undefined,
      telefono: telefono ? telefono : undefined,
      direccion: direccion ? direccion : undefined,
      barrio: barrio ? barrio : undefined,
    };

    const updatedPersona = await Persona.findOneAndUpdate(
      { personaId: personaId },
      updateFields,
      { new: true }
    );
    if (updatedPersona === null) throw new Error("Persona no encontrada.");

    res.send("Persona actualizada: " + updatedPersona.personaId);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const deletePersona = async (req, res) => {
  try {
    const { personaId } = req.params;
    const fechaEliminacion = moment().tz("America/Bogota").format("YYYY-MM-DD");
    console.log("FECHA ELIMINACION", fechaEliminacion);

    const persona = await Persona.findOneAndUpdate(
      { personaId: personaId },
      { activo: false, fechaEliminacion },
      { new: true }
    );

    if (persona === null) throw new Error("Persona no encontrada.");
    res.send("Persona eliminada: " + persona.personaId);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

module.exports = { getPersona, createPersona, updatePersona, deletePersona };
