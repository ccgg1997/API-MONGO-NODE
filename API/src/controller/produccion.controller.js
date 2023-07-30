const { request } = require("express");
const Produccion = require("../models/produccion.schema");
const inventarioSchema = require("../models/inventario.schema");
const {
  createMovimientoFunction,
  deleteMovimientoFunction,
} = require("./movimiento.controller");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getProduccion = async (req, res) => {
  try {
    const produccion = await Produccion.find({activo: true}, { __v: 0, _id: 0,'estilos._id':0});
    res.json(produccion);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

const createProduccion = async (req, res) => {
  try {
    console.log(["dentro de createProduccion [000]"]);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name = decoded.name;
    const usuario = userId + "-" + name;
    console.log(["dentro de createProduccion [001]", usuario]);

    const {
      personaId,
      nombrePersona,
      cantidad,
      familiaNombre,
      estilos,
      productoId,
    } = req.body;
    console.log(["dentro de createProduccion [101]"]);
    const now = moment().tz("America/Bogota").format();
    const allValuesExist =
      productoId ??
      personaId ??
      nombrePersona ??
      cantidad ??
      familiaNombre ??
      estilos;

    if (!allValuesExist) {
      throw new Error("Faltan valores");
    }
    const newProduccion = new Produccion({
      produccionId:0,
      productoId,
      personaId,
      nombrePersona,
      fechaInicial: now,
      cantidad,
      familiaNombre,
      estilos,
    });
    const datos = {
      cantidad,
      categoria: "PRODUCCION",
      productoId,
      bodegaId: "E03",
      tipo: "SALIDA",
      estilos,
      usuario,
      factura: now,
    };
    //crear movimiento
    const movimientosCrear = await createMovimientoFunction(datos);
    if (!movimientosCrear) {
      return res.status(400).json({
        message:
          "No se pudo crear movimiento de bodega, problema en los productos ingresados",
      });
    }
    await newProduccion.save();
    res.status(201).json({ message: "Produccion creada" });
  } catch (err) {
    console.log(["dentro de catch createProduccion [104]", err]);
    res.status(400).json({
      error: err,
    });
  }
};

const recibirMaterial = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name = decoded.name;
    const usuario = userId + "-" + name;
    console.log(["dentro de recibirMaterial [000]"]);
    const { produccionId, productoId, estilos, tamanio } = req.body;
    if (!tamanio) {
      throw new Error("Falta el tamanio");
    }
    const multiplicadorCantidad =
      tamanio === "2P" ? 2 : tamanio === "M" ? 1 / 2 : 1;
    const produccion = await Produccion.findOne({ produccionId, activo: true });
    if (!produccion) {
      throw new Error("No existe la producción o ya se termino");
    }

    const cantidadEstilos = estilos.reduce((acc, curr) => {
      return acc + Math.round(curr.cantidad * multiplicadorCantidad);
    }, 0);

    const cantidad = cantidadEstilos;

    produccion.estilos.forEach((estilo) => {
      const estiloRecibido = estilos.find(
        (recibido) => recibido.nombre === estilo.nombre
      );
      if (estiloRecibido) {
        estilo.cantidadRecibida =
          estilo.cantidadRecibida +
          Math.round(estiloRecibido.cantidad * multiplicadorCantidad);
      }
    });

    produccion.cantidadRecibida =
      (produccion.cantidadRecibida || 0) + cantidadEstilos;
    produccion.ultimaFechaEntrega = moment().tz("America/Bogota").format();
    if (produccion.cantidadRecibida >= produccion.cantidad) {
      produccion.activo = false;
    }
    //actualizar inventario, creando un movimiento
    const datos = {
      cantidad,
      categoria: "PRODUCCION",
      productoId,
      bodegaId: "E03",
      tipo: "ENTRADA",
      estilos,
      usuario,
      factura: produccionId,
    };

    console.log(["dentro de recibirMaterial [001], datos pa movimiento:; ", datos]);
    //crear movimiento
    const movimientosCrear = await createMovimientoFunction(datos); 
    await produccion.save();

    res.status(200).json({ message: "Producción actualizada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const movEntreBodegas = async (req, res) => {
  try {
    console.log(["dentro de movEntreBodegas [000]"]);
    const {
      productoId,
      bodegaIdActual,
      bodegaIdFuturo,
      famila,
      estilos,
    } = req.body;

    

    const allValuesExist =
      productoId ??
      bodegaIdActual ??
      bodegaIdFuturo ??
      famila ??
      estilos;
    if (!allValuesExist) {
      throw new Error("Faltan valores");
    }
    const inventarioActual = await inventarioSchema.findOne({
      bodegaId: bodegaIdActual,
      productoId: productoId,
    });

    const inventarioFuturo = await inventarioSchema.findOne({
      productoId: productoId,
      bodegaId: bodegaIdFuturo,
    });

    const cantidadEstilos = estilos.reduce((acc, curr) => {
      return acc +curr.cantidad
    }, 0);

    inventarioActual.cantidad = inventarioActual.cantidad - cantidadEstilos;
    inventarioFuturo.cantidad = inventarioFuturo.cantidad + cantidadEstilos;  
    console.log(["dentro de movEntreBodegas [001]"],'estilos: ',estilos);
    // Restar los valores de estilo de inventarioActual
    console.log(["dentro de movEntreBodegas [001.1]"], inventarioActual.estilos);
    inventarioActual.estilos = inventarioActual.estilos.map((item) => {
      const estilo = estilos.find((e) => e.nombre === item.nombre);
      if (estilo) {
        item.cantidad -= estilo.cantidad;
      }
      return item;
    });

    console.log(["dentro de movEntreBodegas [002]"], inventarioFuturo);
    // Sumar los valores de estilo a inventarioFuturo
    estilos.forEach((estilo) => {
      const estiloEncontrado = inventarioFuturo.estilos.find(
        (item) => item.nombre === estilo.nombre
      );
      if (estiloEncontrado) {
        estiloEncontrado.cantidad += estilo.cantidad;
      } else {
        inventarioFuturo.estilos.push({
          nombre: estilo.nombre,
          cantidad: estilo.cantidad,
        });
      }
    });
    console.log(["dentro de movEntreBodegas [003]"]);
    await inventarioActual.save();
    await inventarioFuturo.save();
    res.status(200).json({ message: "Movimiento entre bodegas exitoso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduccion = async (req, res) => {};

const getOneProduccion = async (req, res) => {};

const updateProduccion = async (req, res) => {};

module.exports = {
  getProduccion,
  createProduccion,
  deleteProduccion,
  getOneProduccion,
  updateProduccion,
  recibirMaterial,
  movEntreBodegas,
};
