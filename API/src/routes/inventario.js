const {Router}=require('express');
const {getInventario, createInventario,deleteInventario,getOneInventario,updateInventario,getBodega,getOneBodega, createBodega } = require('../controller/inventario.controller');
const {authJwt}=require('../middlewares');
const router=Router();

/**
 * @openapi
 * /api/inventario:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Retorna una lista de inventario de productos activos
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del inventario
 *                   productoId:
 *                     type: object
 *                     description: Objeto con el nombre del producto
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del producto
 *                   cantidad:
 *                     type: number
 *                     description: Cantidad del producto en inventario
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el inventario está activo o no
 *       500:
 *         description: Error interno del servidor
 */
router.get('/',getInventario);

/**
 * @openapi
 * /inventario/:producto_id:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtiene un registro de inventario por ID de producto
 *     description: Devuelve un registro de inventario por ID de producto si está activo.
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto en el inventario.
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint.
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve un registro de inventario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID único del inventario.
 *                 codigoProducto:
 *                   type: string
 *                   description: Código único del producto en el inventario.
 *                 productoId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID único del producto.
 *                     nombre:
 *                       type: string
 *                       description: Nombre del producto.
 *                 bodegas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bodegaId:
 *                         type: string
 *                         description: ID de la bodega.
 *                       cantidad:
 *                         type: number
 *                         description: Cantidad actual del producto en la bodega.
 *                 activo:
 *                   type: boolean
 *                   description: Indica si el inventario está activo o no.
 *       '404':
 *         description: No se encontró ningún inventario con ese ID de producto.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/:producto_id',getOneInventario);


router.post('/',createInventario);


module.exports=router;