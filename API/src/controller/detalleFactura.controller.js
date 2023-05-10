const {request} = require('express');
const detalleFacturaSchema = require('../models/detalleFactura.schema');

// Función para obtener todos los detalles de factura
const getDetalleFactura = async (req, res) => {
    try {
        const detalleFactura = await detalleFacturaSchema.find();
        return res.json(detalleFactura);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.message});
    }
}

module.exports = { getDetalleFactura };