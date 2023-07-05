const { request } = require("express");
const inventarioSchema = require("../models/inventario.schema");
const bodegaSchema = require("../models/bodega.schema");
const familiaSchema = require("../models/familia.schema");
const productSchema = require("../models/product.schema");
const moment = require("moment-timezone");

// obtener todos los inventarios
const getInventario = async (req, res) => {
  try {
    const inventario = await inventarioSchema.find(
      {},
      { active: 0, __v: 0, _id: 0, "estilos._id": 0, activo: 0 }
    );
    res.json(inventario);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// crear un inventario
const createInventario = async (req, res) => {
  try {
    const { bodegaId, productoId, cantidad, familiaNombre, estilos } =
      mayuscula(req.body);

    //validacion de datos
    if (estaVacio([bodegaId, productoId, familiaNombre])) {
      return res.status(400).json({
        message:
          "Faltan datos(bodegaid, productoId, familiaNombre) o datos incorrectos ",
      });
    }
    if (
      cantidad === undefined ||
      estilos === undefined ||
      isNaN(cantidad) ||
      estilos.length == 0
    ) {
      return res.status(400).json({
        message:
          "datos (cantidad o estilos) incorrectos " + cantidad + " " + estilos,
      });
    }
    //creando variables que faltan
    const inventarioId = bodegaId + "-" + productoId;
    const fecha = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");

    //existencia de producto, bodega y familia
    const existeProducto = await productSchema.findOne({
      producto_id: productoId,
    });
    const existeBodega = await bodegaSchema.findOne({ bodegaId: bodegaId });
    const existeFamilia = await familiaSchema.findOne({
      nombre: familiaNombre,
    });
    if (
      existeBodega == null ||
      existeProducto == null ||
      existeFamilia == null
    ) {
      return res.status(400).json({
        error: {
          "No se creo inventario. Bodega, producto o familia no existen. bodega existente":
            existeBodega,
          "producto existente": existeProducto,
          "familia existente": existeFamilia,
        },
      });
    }
    //crear el nuevo inventario
    const nuevoInventario = new inventarioSchema({
      bodegaId,
      inventarioId,
      productoId,
      cantidad,
      familiaNombre,
      fecha,
      estilos,
    });

    //guardar el nuevo inventario en mongo db
    await nuevoInventario.save();
    return res.json({ message: "Inventario creado" });
  } catch (err) {
    if (err.code == 11000) {
      console.log(err);
      return res.status(400).json({ message: "Inventario ya existe" + err });
    }
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// actualizar un inventario
const updateInventario = async (req, res) => {
  try {
    const { bodegaId, productoId, estilos, tipo } = mayuscula(req.body);
    //validacion de datos
    if (estaVacio([bodegaId, productoId, tipo])) {
      return res.status(400).json({
        message: "Faltan datos(bodegaid, productoId) o datos incorrectos ",
      });
    }
    if (estilos === undefined || estilos.length == 0) {
      return res.status(400).json({ message: "datos (estilos) incorrectos " });
    }
    const existeInventario = await inventarioSchema.findOne({
      inventarioId: bodegaId + "-" + productoId,
    });
    if (existeInventario == null) {
      return res.status(400).json({
        error: {
          "No se actualizo inventario. Inventario no existe":
            bodegaId + "-" + productoId,
        },
      });
    }

    //entrada o salida de inventario
    const entrada_o_salida_inventario = tipo == "ENTRADA" ? 1 : -1;
    console.log("entrada o salida: " + entrada_o_salida_inventario);

    //actualizar inventario
    updateInventarioFunction(
      bodegaId,
      productoId,
      estilos,
      entrada_o_salida_inventario
    );
    if (!updateInventarioFunction) {
      throw new Error("No se pudo actualizar inventario");
    }
    return res.json({ message: "Inventario actualizado" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};



// -------seccion de funciones auxiliares-----------------
//verificar si hay datos vacios
const estaVacio = (datos) => {
  for (let i = 0; i < datos.length; i++) {
    if (
      datos[i] == null ||
      datos[i] == undefined ||
      datos[i] == "" ||
      datos[i] == " " ||
      typeof datos[i] !== "string"
    ) {
      return true;
    }
  }
  return false;
};

//pasar a mayuscula los datos
const mayuscula = (datos) => {
  const datosMayusculas = {};
  for (let key in datos) {
    if (typeof datos[key] === "string") {
      datosMayusculas[key] = datos[key].toUpperCase();
    } else {
      datosMayusculas[key] = datos[key];
    }
  }
  return datosMayusculas;
};

const updateInventarioFunction = async (
  bodegaId,
  productoId,
  estilos,
  entrada_o_salida
) => {
  try {
    console.log("entra al for de update en inventario function:");
    for (let i = 0; i < estilos.length; i++) {
      const nombre = estilos[i].nombre.toUpperCase();
      const cantidad = estilos[i].cantidad * entrada_o_salida;
      const filter = { productoId: productoId, bodegaId: bodegaId };
      const update = {
        $inc: { cantidad: cantidad, [`estilos.$[estilo].cantidad`]: cantidad },
      };
      const options = { arrayFilters: [{ "estilo.nombre": nombre }] };
      await inventarioSchema.updateOne(filter, update, options);
      console.log(
        "actualizo inventario:cantidad: " + cantidad + " estilo: " + nombre
      );
    }
    console.log("devuelve true");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  getInventario,
  createInventario,
  updateInventario,
  updateInventarioFunction,
};
