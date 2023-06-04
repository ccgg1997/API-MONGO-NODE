const { Router } = require('express');
const { authJwt } = require('../middlewares');
const router = Router();
const {getListaPrecios,getListaPreciosIdCliente} =  require('../controller/listaprecios.controller');

/**
 * @swagger
 * /api/listaprecios:
 *   get:
 *     tags:
 *       - Precios
 *     summary: Obtener lista de precios de productos
 *     description: Endpoint que devuelve la lista de precios de los productos activos
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         description: Token de autenticación JWT para acceder al endpoint
 *     responses:
 *       200:
 *         description: Lista de precios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   producto_id:
 *                     type: string
 *                     description: ID del producto
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                   precio_regular:
 *                     type: number
 *                     description: Precio regular del producto
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
 */
router.get('/',[authJwt.verifyToken], getListaPrecios);

/**
 * @swagger
 * /api/listaprecios/{cliente_id}:
 *   get:
 *     tags:
 *       - Precios
 *     summary: Obtener lista de precios de productos para un cliente específico
 *     description: Endpoint que devuelve la lista de precios de los productos activos para un cliente específico
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         description: Token de autenticación JWT para acceder al endpoint
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de precios obtenida con éxito para el cliente especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: string
 *                     description: ID del producto
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                   precio:
 *                     type: number
 *                     description: Precio del producto para el cliente especificado
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
 */

router.get('/:cliente_id',[authJwt.verifyToken], getListaPreciosIdCliente);

module.exports = router;