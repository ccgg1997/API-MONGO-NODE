const {Router}=require('express');
const { getProduct, createProduct } = require('../controller/product.controller');
const router=Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *    tags:
 *     - Products
 *    description: trae todo los productos del sistema
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           password:
 *            type: string
 *            description: password del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.get('/', getProduct);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     description: Crea un nuevo producto
 *     parameters:
 *       - name: producto_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: P001
 *       - name: nombre
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: Camisa Roja
 *       - name: precio_regular
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 19.99
 *       - name: precio_especial
 *         in: query
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 example: 5f5a5d5c5b5a5f5e5d5c5b5a
 *               precio:
 *                 type: number
 *                 example: 14.99
 *       - name: familia_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: F001
 *       - name: activo
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                 product:
 *                   type: object
 *                   description: Detalles del producto creado
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID del producto creado
 *                     producto_id:
 *                       type: string
 *                       description: Identificador del producto creado
 *                     nombre:
 *                       type: string
 *                       description: Nombre del producto creado
 *                     precio_regular:
 *                       type: number
 *                       description: Precio regular del producto creado
 *                     precio_especial:
 *                       type: array
 *                       description: Precios especiales para cada cliente
 *                       items:
 *                         type: object
 *                         properties:
 *                           cliente_id:
 *                             type: string
 *                             description: ID del cliente con precio especial
 *                           precio:
 *                             type: number
 *                             description: Precio especial para el cliente
 *                     familia_id:
 *                       type: string
 *                       description: ID de la familia a la que pertenece el producto creado
 *                     activo:
 *                       type: boolean
 *                       description: Indica si el producto creado está activo o no
 *       400:
 *         description: Error de validación de entrada
 */

router.post('/',createProduct);




module.exports = router;