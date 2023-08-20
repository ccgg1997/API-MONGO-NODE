const {request} = require('express');
const Evento = require('../models/evento.schema');


const getEventos = async (req, res) => {
    try {
        const eventos = await Evento.find().select('-_id title start identifier');
        return res.json(eventos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

const createEvento = async (req, res) => {
    const { title, start } = req.body;

    // Validar si ya existe un evento con el mismo identificador (title + start)
    const existingEvent = await Evento.findOne({ title, start });
    if (existingEvent) {
        return res.status(400).json({ message: 'Ya existe un evento con el mismo identificador' });
    }

    try {
        const newEvent = new Evento({ title, start });
        const savedEvent = await newEvent.save();
        return res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}


const deleteEvento = async (req, res) => {
    const identificador = req.params.identificador;
    try {
        const deletedEvent = await Evento.findOneAndDelete({ identifier: identificador });
        if (deletedEvent) {
            return res.json(deletedEvent);
        } else {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getEventos,
    createEvento,
    deleteEvento
};
