const {request} = require('express');
const familiaSchema = require('../models/familia.schema');

// Función para obtener todas las familias
const getFamilia = async (req, res) => {
    try {
        console.log("getFamilia. checkpoint 1");
        const familias = await familiaSchema.find({activo : true});

        //validaciones
        if(familias.length === null || familias.length === undefined ){
            return res.status(500).json({ error: "Verifica el Id" });
        }
        if(familias.length ===0) {
            return res.status(200).json({ error: "No hay familias registrada en la base de datos" });
        }
        return res.json(familias);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

// Función para obtener una familia
const getOneFamilia = async (req, res) => {

    try {
        const nombre = req.params.nombre ;
        console.log("getOneFamilia. checkpoint 1", nombre);
        if(nombre ===null || nombre ===undefined || nombre ==="" ){
            return res.status(500).json({ error: "El nombre es requerido" });
        }
        const familia = await familiaSchema.find({nombre:nombre.toUpperCase()});
        return res.json(familia);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Función para crear una familia
const createFamilia = async (req, res) => {
    try {
        const { nombre, estilos } = req.body;
        console.log("createFamilia. checkpoint 1", nombre, estilos);
        if(nombre ===null || nombre ===undefined || nombre ==="" || estilos ===null || estilos ===undefined || estilos ==="" ){
            return  res.status(500).json({ error: "El nombre y los estilos son requeridos" });
        }

        //convertir a mayusculas el nombre 
        const nombreParseado = nombre.toUpperCase();
        //convertit a mayusculas la lista de estilos
        const estilosParseados = estilos.map(function (x) {
            return{ nombre: x.nombre.toUpperCase()};
        });
        const newFamilia = new familiaSchema({
            nombre:nombreParseado,
            estilos:estilosParseados
        });
        await newFamilia.save();
        return res.json({ message: 'Familia creada' });
    } catch (err) {
        if (err.code === 11000) {
            console.log('Error: Familia repetida');
            return res.status(500).json({ error: 'familia repetida' });
          } else {
            console.log('Error:', err);
            return res.status(500).json({ error: err.message });
          }
        
    }
}

// Función para eliminar una familia
const deleteFamilia = async (req, res) => {
    try {
        const nombre = req.params.nombre;
        if(nombre ===null || nombre ===undefined || nombre ==="" ){
            return res.status(500).json({ error: "El id es requerido" });
        }
 
        await familiaSchema.findOneAndUpdate({ nombre: nombre }, { Active: false });
        return res.json({ message: 'Familia eliminada' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

};

module.exports = { getFamilia, getOneFamilia, createFamilia, deleteFamilia };