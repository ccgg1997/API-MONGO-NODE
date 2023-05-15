const { request } = require('express');
const movimientoSchema = require('../models/movimiento.schema');
const inventarioSchema = require('../models/inventario.schema');
const productoSchema = require('../models/product.schema');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const {updateInventarioFunction} = require('./inventario.controller');


// Función para obtener todos los movimientos
async function getMovimiento(req, res) {
  try {
    const movimientos = await movimientoSchema.find();
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Función para obtener un movimiento
const getOneMovimiento = async (req, res) => {
  try {
    const id =req.params.id;
    if(id==null || id==undefined || id=="" || id==" ") {
      return res.status(400).json({ message: 'Falta el id' } )
    };
    const movimiento = await movimientoSchema.findOne({_id:id});
    if (!movimiento) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) { 
    console.log(err);
    res.status(500).json({ error: err.message });
  }

};

const createMovimiento = async (req, res) => {
  try{
    const { cantidad, categoria, productoId, bodegaId, tipo, estilos } = mayuscula(req.body);

    //validacion de datos
    if(estaVacio([categoria,productoId, bodegaId,tipo])){
      return res.status(400).json({ message: 'Faltan datos(categoria, productoId, bodegaId,tipo) o datos incorrectos '});
    }
    if(isNaN(cantidad)|| typeof cantidad !=='number' || estilos===undefined || estilos.length==0){
      console.log("cantidad: "+cantidad+" estilos: "+estilos);
      return res.status(400).json({ message: 'La cantidad debe ser un numero y estilos no debe estar vacio' });
    }
    //existe inventario
    const existeInventario = await inventarioSchema.findOne({inventarioId:bodegaId+"-"+productoId});
        if(existeInventario==null){
            return res.status(400).json({ error: {'No se hizo moviminiento ni se actualizo inventario. Inventario no existe': bodegaId+"-"+productoId}});
        }
    //sacar user del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name = decoded.name;
    const usuario = userId + "-" + name;
    const datos = {cantidad, categoria, productoId, bodegaId, tipo, estilos, usuario};
    //crear movimiento
    const movimientosCreados= await createMovimientoFunction(datos);
    if(!movimientosCreados){
      return res.status(400).json({ message: 'No se pudo crear el movimiento' });
    }
    console.log("Movimiento creado y descuenta de inventario exitoso");
    return res.status(200).json({ message: 'Movimiento creado' });
  }catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//funcion para crear un movimiento entre bodegas (ejemplo: surtir bodega 3 con la cantidad de bodega 1)
const createMovEntreBodegas = async (req, res) => {
  try {

    //traer datos de body y parsearlos
    const {productoId, bodegaId1, bodegaId2, cantidad,estilos } = mayuscula(req.body);

    //validacion de datos
    if(estaVacio([productoId, bodegaId1, bodegaId2])){
      return res.status(400).json({ message: 'Faltan datos( productoId, bodegaId) o datos incorrectos '+productoId+"-"+bodegaId1+"-"+bodegaId2 });
    }
    if(isNaN(cantidad)|| typeof cantidad !=='number' || estilos===undefined || estilos.length==0){
      console.log("cantidad: "+cantidad+" estilos: "+estilos);
      return res.status(400).json({ message: 'La cantidad debe ser un numero y estilos no debe estar vacio'+cantidad });
    }
    if(bodegaId1===bodegaId2){
      throw new Error(`Las bodegas no pueden ser iguales`);
    }
    if(cantidad<=0){
      throw new Error(`La cantidad debe ser mayor a 0`);
    }

    //existe inventario
    const existeInventario1 = await inventarioSchema.findOne({inventarioId:bodegaId1+"-"+productoId});
    const existeInventario2 = await inventarioSchema.findOne({inventarioId:bodegaId2+"-"+productoId});
    if(existeInventario1==null || existeInventario2==null){
        return res.status(400).json({ error: {'No se hizo moviminiento ni se actualizo inventario. Inventario no existe': bodegaId1+"-"+productoId+ " o "+bodegaId2+"-"+productoId}});
    }

    //extrayendo el usuario del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name=decoded.name;
    const usuario= userId+"-"+name;

    
    //crear movimiento1(entrada)
    const datos1 = {cantidad:cantidad, categoria:"SURTIDOENTREBODEGA", productoId:productoId, bodegaId:bodegaId1, tipo:"ENTRADA", estilos:estilos, usuario:usuario};
    console.log("datos1: "+JSON.stringify(datos1));
    const movimientosCreados1= await createMovimientoFunction(datos1);
    if(!movimientosCreados1){
      return res.status(400).json({ message: 'No se pudo crear el movimiento de ingreso a la bodega'+ bodegaId1 });
    }

    //crear movimiento2(salida)
    const datos2 = {cantidad:cantidad, categoria:"SURTIDOENTREBODEGA", productoId:productoId, bodegaId:bodegaId2, tipo:"SALIDA", estilos:estilos, usuario:usuario};
    const movimientosCreados2= await createMovimientoFunction(datos2,res);
    if(!movimientosCreados2){
      return res.status(400).json({ message: 'No se pudo crear el movimiento de salida de la bodega '+ bodegaId2  }); 
    }

    res.json({ message: 'Movimiento creado' });
  }
  catch (err) {
    res.status(500).json({ error: "No se pudo crear el movimiento: " + err.message });
  } 

};

//funcion para elminar movimiento por id
const deleteMovimiento = async (req, res) => {
  try {
    console.log("entro a deleteMovimiento [001]")
    //verificar que el id no sea nulo
    const id =req.params.id;
    if(id==null || id==undefined || id=="" || id==" ") {
      return res.status(400).json({ message: 'Falta el id' } )
    };
    console.log("valida id en deleteMovimiento [002]");

    //sacar user del token
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, config.SECRET);
    const userId = decoded.idUser;
    const name = decoded.name;
    const usuario = userId + "-" + name;

    //eliminar movimiento
    const movEliminado = await deleteMovimientoFunction(id,usuario);
    if(movEliminado===null || movEliminado===undefined || movEliminado==="" || movEliminado===" " || !movEliminado){
      return res.status(400).json({ message: 'No se pudo eliminar el movimiento,revise que el _id sea valido y este activo' });
    }
    console.log("Movimiento eliminado exitosamente",movEliminado);
    res.json({ message: 'Movimiento eliminado' });  
  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: err.message });
  }
};



// ---------------------------------funciones auxiliares---------------------------------

const estaVacio = (datos) => {
  for (let i = 0; i < datos.length; i++) {
      if (datos[i] == null || datos[i] == undefined || datos[i] == "" || datos[i] == " " || typeof datos[i] !== "string") {
          return true;
      }
  }
  return false;
}

//pasar a mayuscula los datos
const mayuscula = (datos) => {
  const datosMayusculas = {};
  for (let key in datos) {
    if (typeof datos[key] === 'string') {
      datosMayusculas[key] = datos[key].toUpperCase();
    } else {
      datosMayusculas[key] = datos[key];
    }
  }
  return datosMayusculas;
}

//funcion para crear movimiento
const createMovimientoFunction = async(datos)=>{ 
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    //parsear datos
    const datosMayusculas = mayuscula(datos);
    const {cantidad, categoria, productoId, bodegaId, tipo, estilos, usuario,factura} = datosMayusculas;

    let factura1 =" ";
    //sacando factura
    if(factura==null || factura==undefined || factura=="" || factura==" "){
      factura1=""
    }
    else{
      factura1=factura;
    }
    
 
    //formato de datos para movimiento schema
    const fecha = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    //schema de movimiento
    const newMovimiento = new movimientoSchema({ tipo, fecha, cantidad, productoId, bodegaId, usuario, categoria, estilos, factura:factura1 });

    //actualizar inventario con base a los estilos del producto del movimiento actual
    const entrada_o_salida_inventario = tipo == "ENTRADA" ? 1 : -1;
    const mov_productos_inventario = await updateInventarioFunction(bodegaId, productoId, estilos, entrada_o_salida_inventario);
    console.log("check point 2:",datosMayusculas,'mov_procustos_inventarios: ',mov_productos_inventario, 'dentro de la funcion createMovimientoFunction en movimientoControlador','estilo:',estilos,'bodegaid:',bodegaId,'productoId:',productoId);
    if (!mov_productos_inventario) {
      throw new Error('No se pudo actualizar inventario');
    }
    console.log('checpoint3 : despues de mov inventarios)', 'bodegaId ',bodegaId ) 
    //guardar movimiento
    await newMovimiento.save({ session });
    console.log('checpoint4 : despues de mov inventarios. save) ')
    await session.commitTransaction();
    console.log('checpoint5 : despues de mov inventarios. commit) ')
    return newMovimiento;

  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return false;
  } finally {
    session.endSession();
  }
};

//funcion para eliminar movimiento (retorna el inventario a su estado anterior)
const deleteMovimientoFunction = async (idMovimiento,usuario) => {  
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
        //formato de datos de fecha
        const fechaEliminacion = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

        //buscando documento
        const movimiento = await movimientoSchema.findById({_id:idMovimiento,activo:true });
        if (movimiento === undefined ||!movimiento || !movimiento.activo ) {
          return false;
        }
        console.log("check point 0 deletemovimiento:",movimiento);
        
        //sacando detalles de
        const estilos = movimiento.estilos;
        const cantidad = movimiento.cantidad;
        const tipo = movimiento.tipo === "ENTRADA" ? "SALIDA" : "ENTRADA";
        const bodegaId = movimiento.bodegaId;
        const productoId = movimiento.productoId;
        const categoria = "DEVOLUCION";
        console.log("check point 1 functiondeleteMov:",estilos, cantidad, tipo, bodegaId, productoId, categoria);
       
        //modificar estado de movimiento
        movimiento.activo = false;
        movimiento.fechaEliminacion = fechaEliminacion;
        await movimiento.save({ session });

        //definir datos de movimiento
        const datos = {cantidad, categoria, productoId, bodegaId, tipo, estilos, usuario};

        //crear movimiento
        const movimientosCreados= await createMovimientoFunction(datos);
        if(!movimientosCreados){
          return false;
        } 

        await session.commitTransaction();
        session.endSession();
        return true;
  }
  catch (err) {
    console.log(err);
    await session.abortTransaction();
    return false;
  } finally {
    session.endSession();
  }
};

module.exports = {

  getMovimiento, getOneMovimiento,createMovimiento,deleteMovimiento,createMovEntreBodegas,createMovimientoFunction,deleteMovimientoFunction
 
};
