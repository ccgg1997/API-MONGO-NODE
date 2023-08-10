const { request } = require("express");
const movimientoSchema = require("../models/movimiento.schema");
const facturaSchema = require("../models/factura.schema");
const detalleSchema = require("../models/detalleFactura.schema");
const negocioSchema = require("../models/negocio.schema");
const {
    createMovimientoFunction,
    deleteMovimientoFunction,
} = require("./movimiento.controller");
const productoSchema = require("../models/product.schema");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const config = require("../config");
const detalleFacturaSchema = require("../models/detalleFactura.schema");

// Función para obtener todas las facturas
const getFactura = async (req, res) => {
    try {
        const facturas = await facturaSchema.find({ activo: true });
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Función para obtener una factura
const getOneFactura = async (req, res) => {
    try {
        let factura = [];
        let detalleFactura = [];
        let negocio = [];

        const id = req.params.id;
        if (id == null || id == undefined || id == "" || id == " ") {
            return res.status(400).json({ message: "Falta el id" });
        }
        const todoFactura = await facturaSchema.findOne({ id: id, activo: true });
        if (todoFactura === undefined || todoFactura === null) {
            res.status(400).json({ error: "el id de factura ingresada no existe" });
            return;
        }

        factura = {
            id: todoFactura.id,
            fecha: todoFactura.fecha,
            total: todoFactura.total,
        };

        const todoDetalleFactura = await detalleFacturaSchema.findOne({
            facturaId: id,
            activo: true,
        });
        if (todoDetalleFactura === undefined || todoDetalleFactura === null) {
            res.status(400).json({ error: "el id de factura ingresada no existe" });
            return;
        }

        const productosConTotal = todoDetalleFactura.productos.map((producto) => {
            const total = producto.cantidad * producto.precio;
            return { ...producto.toObject(), total };
        });

        detalleFactura = {
            productos: productosConTotal,
        };

        const todoNegocio = await negocioSchema.findOne({
            id: todoFactura.negocioId,
            active: true,
        });
        if (negocio === undefined || negocio === null) {
            res.status(400).json({ error: "negocio no encontrado" });
            return;
        }

        negocio = {
            nombre: todoNegocio.negocio,
            duenio: todoNegocio.duenio,
            telefono: todoNegocio.telefono,
            barrio: todoNegocio.barrio,
            direccion: todoNegocio.direccion,
        };

        return res.json({ factura, detalleFactura, negocio });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

//funcion para obtener facturas por rango de fecha
const getFacturaByDateRange = async (req, res) => {
    try {
        const fechaInicio = req.params.fechaInicio;
        const fechaFin = req.params.fechaFin;
        if (isEmpty([fechaInicio, fechaFin])) {
            return res
                .status(400)
                .json({ message: "Faltan datos o datos incorrectos" });
        }

        const fechaDateInicio = new Date(fechaInicio);
        const fechaDateFin = new Date(fechaFin);
        const facturas = await facturaSchema
            .find({ fecha: { $gte: fechaDateInicio, $lte: fechaDateFin } })
            .select({
                fecha: 1,
                id: 1,
                _id: 0,
                negocioNombre: 1,
                total: 1,
            });
        const facturasDesglosadas = facturas.map((factura) => {
            const { dia, mes, ano } = desglosarFecha(factura.fecha);
            return {
                ...factura.toObject(),
                dia,
                mes,
                ano,
            };
        });
        res.json(facturasDesglosadas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFacturaByLast3Months = async (req, res) => {
    try {
        const now = new Date();
        const periodo1 = new Date(now)
        periodo1.setDate(now.getDate() - 89);
        const finperiodo1 = new Date(now)
        finperiodo1.setDate(now.getDate() - 60);

        const periodo2 = new Date(now)
        periodo2.setDate(now.getDate() - 59);
        const finPeriodo2 = new Date(now)
        finPeriodo2.setDate(now.getDate() - 30);

        const periodo3 = new Date(now)
        periodo3.setDate(now.getDate() - 29);
        const finPeriodo3 = new Date(now)
        finPeriodo3.setDate(now.getDate());

        const periodos = [
            { inicio: periodo1, fin: finperiodo1 },
            { inicio: periodo2, fin: finPeriodo2 },
            { inicio: periodo3, fin: finPeriodo3 },
            { inicio: periodo1, fin: finPeriodo3 }

        ]

        for (let i = 0; i < periodos.length; i++) {
            const clientesFacturas = await facturaSchema.aggregate([
                {
                    $match: {
                        fecha: {
                            $gte: periodos[i].inicio,
                            $lte: periodos[i].fin
                        }
                    }
                },
                {
                    $group: {
                        _id: '$negocioNombre',
                        total: { $sum: "$total" }
                    }
                }
            ])
            const ventasIntervalo = await facturaSchema.aggregate([
                {
                    $match: {
                        fecha: {
                            $gte: periodos[i].inicio,
                            $lte: periodos[i].fin
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
                        total: { $sum: '$total' }
                    }
                }
            ])
            let subtotal = ventasIntervalo.reduce((acc, venta) => acc + venta.total, 0)
            periodos[i].clientes = clientesFacturas
            periodos[i].ventasDia = ventasIntervalo
            periodos[i].totalVentasDia = subtotal

        }

        res.json(periodos)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Función para crear una factura
const createFactura = async (req, res) => {
    //iniciar transaccion
    const session = await facturaSchema.startSession();
    session.startTransaction();
    try {
        //obtener datos
        const { negocioId, total, productos } = mayuscula(req.body);
        const fecha = new Date(
            moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss")
        );
        //extrayendo el usuario del token
        const token = req.headers["x-access-token"];
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded.idUser;
        const name = decoded.name;
        const usuario = userId + "-" + name;

        //info
        //sacando ultima factura y pasando el serial a hexadecimal para la proxima factura
        const ultimaFactura = await facturaSchema
            .findOne()
            .sort({ _id: -1 })
            .limit(1);
        const proximaFactura = ultimaFactura ? ultimaFactura.inc_field + 1 : 1;
        const hexa = proximaFactura.toString(16).padStart(8, "0").toUpperCase();

        //validar datos
        if (isEmpty([negocioId, total, productos])) {
            return res
                .status(400)
                .json({ message: "Faltan datos o datos incorrectos" });
        }

        //isEmpty que negocio existe
        const negocioExiste = await negocioSchema.findOne({ id: negocioId });
        if (isEmpty([negocioExiste])) {
            return res
                .status(400)
                .json({
                    message: "Negocio no existe, ingrese negocio valido para la factura",
                });
        }

        const negocioNombre = negocioExiste.negocio;

        //verificando informacion de productos
        for (let i = 0; i < productos.length; i++) {
            //isEmpty de que no este vacio el producto id
            if (isEmpty([productos[i].productoId])) {
                return res
                    .status(400)
                    .json({ message: "datos incompletos en producto" });
            }

            //pasar minusculas a mayusculas
            const productIdMayu = productos[i].productoId.toUpperCase();
            const familiaMayu = productos[i].familia.toUpperCase();

            // verificacion que producto id existe en la base de datos
            const productoExiste = await productoSchema.findOne({
                producto_id: productIdMayu,
            });
            if (productoExiste == null || productoExiste == undefined) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Producto no existe, ingrese producto valido para la factura",
                    });
            }
            //isEmpty de cantidad del producto no sea menor a 0
            if (isEmpty([productos[i].cantidad]) || productos[i].cantidad <= 0) {
                return res
                    .status(400)
                    .json({
                        message: "Falta cantidad de producto" + productos[i].productoId,
                    });
            }
            //isEmpty de que no este vacia la familia
            if (isEmpty([productos[i].familia])) {
                return res
                    .status(400)
                    .json({
                        message: "Falta familia de producto" + productos[i].productoId,
                    });
            }
        }

        //creandomovimientos de bodegas por producto
        for (let i = 0; i < productos.length; i++) {
            //extrayendo datos de productos
            const cantidadProducto = productos[i].cantidad;
            const categoriaProducto = productos[i].familia;
            const productoIdProducto = productos[i].productoId;
            const estilos = productos[i].estilos;
            //datos para crear movimiento
            const datos = {
                cantidad: cantidadProducto,
                categoria: "VENTA",
                productoId: productoIdProducto,
                bodegaId: "E03",
                tipo: "SALIDA",
                estilos,
                usuario,
                factura: hexa,
            };

            //lo que se manda a crear movimiento

            //crear movimiento
            const movimientosCrear = await createMovimientoFunction(datos);
            if (!movimientosCrear) {
                return res
                    .status(400)
                    .json({
                        message:
                            "No se pudo crear movimiento de bodega, problema en los productos ingresados",
                    });
            }
        }

        //creacion de detalles de factura
        const detalleFactura = new detalleFacturaSchema({
            facturaId: hexa,
            productos: productos,
            fecha: fecha,
        });

        //creacion de factura
        const factura = new facturaSchema({
            id: "hola",
            negocioId: negocioId,
            negocioNombre: negocioNombre,
            fecha: fecha,
            total: total,
        });

        //guardar factura y detalle de factura

        const facturaGuardada = await factura.save({ session: session });
        await detalleFactura.save({ session: session });

        //guardar movimiento
        await session.commitTransaction();
        res
            .status(201)
            .json({ message: "Factura creada1", id: facturaGuardada.id });
        session.endSession();
    } catch (err) {
        await session.abortTransaction();
        if (err.code === 11000) {
            return res.status(400).json({ error: "Factura ya existe" });
        }
        res
            .status(500)
            .json({ error: "No se pudo crear la factura: " + err.message });
    } finally {
        session.endSession();
    }
};

//funcion para eliminar factura
const deleteFactura = async (req, res) => {
    try {
        const id = req.params.id.toUpperCase();
        if (id == null || id == undefined || id == "" || id == " ") {
            return res.status(400).json({ message: "Falta el id" });
        }

        //extrayendo el usuario del token
        const fecha = new Date(
            moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss")
        );
        const token = req.headers["x-access-token"];
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded.idUser;
        const name = decoded.name;
        const usuario = userId + "-" + name;

        const movEliminar = await movimientoSchema.find(
            { factura: id, activo: true },
            { id }
        );
        if (movEliminar === undefined || movEliminar === null) {
            res.status(400).json({ error: "el id de factura ingresado no existe" });
        }

        for (let i = 0; i < movEliminar.length; i++) {
            await deleteMovimientoFunction(movEliminar[i].id, usuario);
        }

        const facturaEliminar = await facturaSchema.findOneAndUpdate(
            { id: id, activo: true },
            { activo: false, fechaEliminacion: fecha },
            { new: true }
        );
        if (facturaEliminar === undefined || facturaEliminar === null) {
            res.status(400).json({ error: "el id de factura ingresado no existe" });
        }

        res.json(movEliminar);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

//Función para valir que los datos no esten vacios
function isEmpty(datos) {
    //isEmptyes de campos vacios o nulos
    for (const propiedad in datos) {
        if (
            datos[propiedad] == null ||
            datos[propiedad] == undefined ||
            datos[propiedad] == "" ||
            datos[propiedad] == " "
        ) {
            return true;
        }
    }
    return false;
}

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

//desglosar una fecha a dia mes y año
const desglosarFecha = (fecha) => {
    if (fecha == null || fecha == undefined || fecha == "" || fecha == " ") {
        return null;
    }
    const fechaDesglosada = {
        dia: fecha.getDate(),
        mes: fecha.getMonth() + 1,
        ano: fecha.getFullYear(),
    };
    return fechaDesglosada;
};

module.exports = {
    getFactura,
    getOneFactura,
    createFactura,
    deleteFactura,
    getFacturaByDateRange,
    getFacturaByLast3Months,
};
