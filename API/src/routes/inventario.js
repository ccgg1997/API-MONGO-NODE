const { Router } = require('express');
const{getInventario,createInventario, updateInventario} = require('../controller/inventario.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     tags: [Inventario]
 *     summary: Obtiene todos los registros de inventario.
 *     description: Obtiene una lista de todos los registros de inventario registrados en el sistema.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token de autenticación para validar la sesión del usuario.
 *     responses:
 *       '200':
 *         description: Lista de registros de inventario.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bodegaId:
 *                     type: string
 *                     description: Identificador de la bodega.
 *                   productoId:
 *                     type: string
 *                     description: Identificador del producto.
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha del registro de inventario.
 *                   cantidad:
 *                     type: number
 *                     description: Cantidad del registro de inventario.
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el registro de inventario está activo o no.
 *                   fechaEliminacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha en que se eliminó el registro de inventario.
 *                   familia:
 *                     type: string
 *                     description: Familia del producto.
 *                   estilos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           description: Motivo del registro de inventario.
 *                         cantidad:
 *                           type: number
 *                           description: Cantidad del registro de inventario.
 *       '401':
 *         description: No autorizado. El usuario no está autenticado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', [authJwt.verifyToken], getInventario);

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     tags: [Inventario]
 *     summary: Crea un nuevo registro de inventario
 *     description: Crea un nuevo registro de inventario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bodegaId:
 *                 type: string
 *                 description: Identificador de la bodega.
 *               productoId:
 *                 type: string
 *                 description: Identificador del producto.
 *               cantidad:
 *                 type: number
 *                 description: Cantidad del registro de inventario.
 *               familiaNombre:
 *                 type: string
 *                 description: Familia del producto.
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: Motivo del registro de inventario.
 *                     cantidad:
 *                       type: number
 *                       description: Cantidad del registro de inventario.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación para validar la sesión del usuario.
 *     responses:
 *       '201':
 *         description: Registro de inventario creado exitosamente.
 *       '401':
 *         description: No autorizado. El usuario no está autenticado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', [authJwt.verifyToken],createInventario);

/**
 * @swagger
 * /api/inventario:
 *   put:
 *     tags: [Inventario]
 *     summary: Actualiza los estilos de un producto en una bodega
 *     requestBody:
 *       required: true
 *       description: El ID de la bodega, el ID del producto y un arreglo de objetos con el nombre y la cantidad de cada estilo a actualizar
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                type: string
 *                description: El tipo de operación a realizar (entrada o salida)
 *                enum: [entrada, salida]
 *               bodegaId:
 *                 type: string
 *                 description: El ID de la bodega
 *               productoId:
 *                 type: string
 *                 description: El ID del producto
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
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación para validar la sesión del usuario.
 *     responses:
 *       200:
 *         description: El inventario fue actualizado correctamente
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Un mensaje de confirmación
 *       400:
 *         description: Alguno de los parámetros enviados es inválido
 *       500:
 *         description: Error interno del servidor
 */
router.put('/', [authJwt.verifyToken], updateInventario);   


module.exports = router;
