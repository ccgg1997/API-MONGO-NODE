const { Router } = require('express');
const { getMovimiento,getOneMovimiento, createMovimiento,deleteMovimiento,createMovEntreBodegas} = require('../controller/movimiento.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @openapi
 * /api/movimiento:
 *   get:
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     summary: Obtener todos los movimientos
 *     description: Retorna un arreglo con todos los movimientos registrados en el sistema.
 *     tags: [Movimiento]
 *     responses:
 *       200:
 *         description: Movimiento encontrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del movimiento
 *                 tipo:
 *                   type: string
 *                   description: Tipo de movimiento (entrada o salida)
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha del movimiento
 *                 cantidad:
 *                   type: number
 *                   description: Cantidad del movimiento
 *                 usuario:
 *                   type: string
 *                   description: Usuario que realizó el movimiento
 *                 productoId:
 *                   type: string
 *                   description: ID del producto asociado al movimiento
 *                 bodegaId:
 *                   type: string
 *                   description: ID de la bodega donde se realizó el movimiento
 *                 activo:
 *                   type: boolean
 *                   description: Indica si el movimiento está activo o no
 *                 fechaEliminacion:
 *                   type: string
 *                   format: date
 *                   description: Fecha en que se eliminó el movimiento (si aplica)
 *                 categoria:
 *                   type: string
 *                   description: Categoría del movimiento (producción, venta o devolución)
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
 */
router.get('/', [authJwt.verifyToken], getMovimiento);


/**
 * @swagger
 * /api/movimiento/{id}:
 *   get:
 *     tags:
 *       - Movimiento
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID del movimiento a buscar
 *     summary: Obtener un movimiento por ID
 *     description: Endpoint que devuelve un movimiento específico en el sistema, identificado por su ID
 *     responses:
 *       200:
 *         description: Movimiento encontrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del movimiento
 *                 tipo:
 *                   type: string
 *                   description: Tipo de movimiento (entrada o salida)
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha del movimiento
 *                 cantidad:
 *                   type: number
 *                   description: Cantidad del movimiento
 *                 usuario:
 *                   type: string
 *                   description: Usuario que realizó el movimiento
 *                 productoId:
 *                   type: string
 *                   description: ID del producto asociado al movimiento
 *                 bodegaId:
 *                   type: string
 *                   description: ID de la bodega donde se realizó el movimiento
 *                 activo:
 *                   type: boolean
 *                   description: Indica si el movimiento está activo o no
 *                 fechaEliminacion:
 *                   type: string
 *                   format: date
 *                   description: Fecha en que se eliminó el movimiento (si aplica)
 *                 categoria:
 *                   type: string
 *                   description: Categoría del movimiento (producción, venta o devolución)
 *                 estilos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: El nombre del estilo a actualizar
 *                       cantidad:
 *                         type: integer
 *                         description: La cantidad a incrementar o decrementar
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 * 
 */ 
router.get('/:id', [authJwt.verifyToken], getOneMovimiento);

/**
 * @swagger
 * /api/movimiento/moventrebodegas:
 *   post:
 *     summary: Crear un nuevo movimiento entre bodegas.
 *     description: Crear un nuevo movimiento de tipo entrada y salida en dos bodegas distintas de un mismo producto.
 *     tags: [Movimiento]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         type: string
 *     requestBody:
 *       description: Objeto JSON con los datos necesarios para crear el movimiento entre bodegas.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *                 description: ID del producto que se desea mover entre bodegas.
 *               bodegaId1:
 *                 type: string
 *                 description: ID de la bodega de salida.
 *               bodegaId2:
 *                 type: string
 *                 description: ID de la bodega de entrada.
 *               cantidad:
 *                 type: number
 *                 description: Cantidad de unidades del producto a mover entre bodegas.
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: El nombre del estilo a actualizar
 *                     cantidad:
 *                       type: integer
 *                       description: La cantidad a incrementar o decrementar
 *     responses:
 *       200:
 *         description: Movimiento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       500:
 *         description: Error al crear el movimiento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error.
 */
router.post('/moventrebodegas', [authJwt.verifyToken], createMovEntreBodegas);

/**
 * @swagger
 * /api/movimiento:
 *   post:
 *     summary: Crea un nuevo movimiento
 *     tags:
 *       - Movimiento
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     requestBody:
 *       description: Datos del movimiento a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de movimiento ("entrada" o "salida")
 *                 example: entrada
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del movimiento
 *                 example: 10
 *               productoId:
 *                 type: string
 *                 description: ID del producto
 *                 example: ABC123
 *               bodegaId:
 *                 type: string
 *                 description: ID de la bodega
 *                 example: BODEGA1
 *               categoria:
 *                 type: string
 *                 description: Categoría del movimiento
 *                 example: Categoría1
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: El nombre del estilo a actualizar
 *                     cantidad:
 *                       type: integer
 *                       description: La cantidad a incrementar o decrementar
 *             required:
 *               - tipo
 *               - cantidad
 *               - productoId
 *               - bodegaId
 *     responses:
 *       200:
 *         description: Movimiento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito de creación.
 *                   example: Movimiento creado
 *       400:
 *         description: Datos del movimiento inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de datos inválidos.
 *                   example: Datos del movimiento inválidos
 *       401:
 *         description: Token de autenticación inválido o no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de autenticación inválida.
 *                   example: Token de autenticación inválido o no proporcionado
 *       404:
 *         description: Producto o bodega no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de producto o bodega no encontrados.
 *                   example: El producto ABC123 no existe
 */
router.post('/', [authJwt.verifyToken], createMovimiento);

/**
 * @swagger
 * /api/movimiento/{id}:
 *   delete:
 *     summary: Elimina un movimiento por ID
 *     tags:
 *       - Movimiento
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: id
 *         description: ID del movimiento a eliminar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movimiento eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito de eliminación.
 *                   example: Movimiento eliminado
 *       404:
 *         description: Movimiento no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error de movimiento no encontrado.
 *                   example: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error del servidor.
 *                   example: Error interno del servidor
 */
router.delete('/:id', [authJwt.verifyToken], deleteMovimiento);


module.exports = router;
