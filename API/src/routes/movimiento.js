const { Router } = require('express');
const { getMovimiento,getOneMovimiento, createMovimiento,deleteMovimiento} = require('../controller/movimiento.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @swagger
 * /api/movimiento:
 *   get:
 *     tags:
 *       - Movimiento
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     summary: Obtener todos los movimiento
 *     description: Endpoint que devuelve una lista de todos los movimiento en el sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimiento recuperada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del movimiento
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     description: Fecha del movimiento
 *                   tipo:
 *                     type: string
 *                     description: Tipo de movimiento (Ingreso o egreso)
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del movimiento
 *                   monto:
 *                     type: number
 *                     description: Monto del movimiento
 *                   categoria:
 *                     type: string
 *                     description: Categoría del movimiento
 *                   negocio:
 *                     type: object
 *                     description: Negocio asociado al movimiento
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID del negocio
 *                       nombre:
 *                         type: string
 *                         description: Nombre del negocio
 *                       direccion:
 *                         type: string
 *                         description: Dirección del negocio
 *                       telefono:
 *                         type: string
 *                         description: Teléfono del negocio
 *                       activo:
 *                         type: boolean
 *                         description: Indica si el negocio está activo o no
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
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
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
 *         required: true
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
 *                 id:
 *                   type: string
 *                   description: ID del movimiento
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha del movimiento
 *                 tipo:
 *                   type: string
 *                   description: Tipo de movimiento (Ingreso o egreso)
 *                 descripcion:
 *                   type: string
 *                   description: Descripción del movimiento
 *                 monto:
 *                   type: number
 *                   description: Monto del movimiento
 *                 categoria:
 *                   type: string
 *                   description: Categoría del movimiento
 *                 negocio:
 *                   type: object
 *                   description: Negocio asociado al movimiento
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID del negocio
 *                     nombre:
 *                       type: string
 *                       description: Nombre del negocio
 *                     direccion:
 *                       type: string
 *                       description: Dirección del negocio
 *                     telefono:
 *                       type: string
 *                       description: Teléfono del negocio
 *                     activo:
 *                       type: boolean
 *                       description: Indica si el negocio está activo o no
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
 * /api/movimiento:
 *   post:
 *     summary: Crea un nuevo movimiento
 *     tags:
 *       - Movimiento
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de movimiento (entrada o salida)
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del producto que se mueve
 *               usuario:
 *                 type: string
 *                 description: Usuario que realiza el movimiento
 *               productoId:
 *                 type: string
 *                 description: ID del producto que se mueve
 *               bodegaId:
 *                 type: string
 *                 description: ID de la bodega donde se realiza el movimiento
 *     responses:
 *       200:
 *         description: Movimiento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación del movimiento creado
 *                   example: Movimiento creado
 *       500:
 *         description: Error al crear el movimiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error que indica lo sucedido
 *                   example: Error al crear el movimiento
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
