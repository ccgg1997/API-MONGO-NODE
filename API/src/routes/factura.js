const { Router } = require('express');
const { getFactura,getOneFactura, createFactura,deleteFactura} = require('../controller/factura.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @openapi
 * /api/factura:
 *   get:
 *     summary: Obtener todas las facturas
 *     description: Retorna un arreglo con todas las facturas registradas en el sistema.
 *     tags: [Factura]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         type: string
 *     responses:
 *       200:
 *         description: Facturas encontradas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la factura
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     description: Fecha de la factura
 *                   clienteId:
 *                     type: string
 *                     description: ID del cliente asociado a la factura
 *                   clienteNombre:
 *                     type: string
 *                     description: Nombre del cliente asociado a la factura
 *                   total:
 *                     type: number
 *                     description: Total de la factura
 *                   activo:
 *                     type: boolean
 *                     description: Indica si la factura está activa o no
 *                   fechaEliminacion:
 *                     type: string
 *                     format: date
 *                     description: Fecha en que se eliminó la factura (si aplica)
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
router.get('/', [authJwt.verifyToken], getFactura);

router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], getOneFactura);

/**
 * @swagger
 * /api/factura:
 *   post:
 *     summary: Crea una nueva factura con su detalle de productos
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     tags: 
 *       - Factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               negocioId:
 *                 type: string
 *                 description: Identificador del negocio asociado a la factura
 *                 example: 12345
 *               total:
 *                 type: number
 *                 description: Total de la factura
 *                 example: 10000.00
 *               facturaId:
 *                 type: string
 *                 description: Identificador único de la factura
 *                 example: e11
 *               productos:
 *                 type: array
 *                 description: Detalle de productos de la factura
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       description: Identificador del producto
 *                       example: E577777
 *                     cantidad:
 *                       type: number
 *                       description: Cantidad del producto en la factura
 *                       example: 2
 *                     precio:
 *                       type: number
 *                       description: Precio unitario del producto en la factura
 *                       example: 5000.00
 *                     familia:
 *                       type: string
 *                       description: Familia del producto en la factura
 *                       example: FINA
 *                     estilos:
 *                       type: array
 *                       description: Detalle adicional del producto en la factura
 *                       items:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                             description: Motivo del detalle
 *                             example: azul
 *                           cantidad:
 *                             type: number
 *                             description: Cantidad del detalle
 *                             example: 15
 *             example:
 *               negocioId: 12345
 *               total: 10000.00
 *               facturaId: e11
 *               productos:
 *                 - productoId: E577777
 *                   productoNombre: Producto 1
 *                   cantidad: 2
 *                   precio: 5000.00
 *                   familia: FINA
 *                   detalle: 
 *                     - motivo: azul
 *                       cantidad: 15
 *     responses:
 *       '201':
 *         description: Factura creada satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación de creación de la factura
 *                   example: Factura creada
 *       '400':
 *         description: Faltan datos o tipo de dato incorrecto en la petición
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error explicando qué campo de la petición es incorrecto o falta
 *                   example: Faltan datos
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error inter        
*/
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], createFactura);

// router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], deleteFactura);

module.exports = router;  