const { Router } = require('express');
const{getDetalleFactura} = require('../controller/detalleFactura.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @swagger
 * /api/detalleFactura:
 *   get:
 *     tags: [FacturaDetalle]
 *     summary: Obtiene todos los detalles de factura
 *     description: Obtiene una lista de todos los detalles de factura registrados en el sistema.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token de autenticación para validar la sesión del usuario.
 *     responses:
 *       '200':
 *         description: Lista de detalles de factura.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   facturaId:
 *                     type: string
 *                     description: Identificador de la factura.
 *                   productoId:
 *                     type: string
 *                     description: Identificador del producto.
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha del detalle de factura.
 *                   cantidad:
 *                     type: number
 *                     description: Cantidad del detalle de factura.
 *                   precio:
 *                     type: number
 *                     description: Precio del detalle de factura.
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el detalle de factura está activo o no.
 *                   fechaEliminacion:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha en que se eliminó el detalle de factura.
 *                   familia:
 *                     type: string
 *                     description: Familia del producto.
 *                   detalle:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         motivo:
 *                           type: string
 *                           description: Motivo del detalle de factura.
 *                         cantidad:
 *                           type: number
 *                           description: Cantidad del detalle de factura.
 *       '401':
 *         description: No autorizado. El usuario no está autenticado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/',getDetalleFactura);

module.exports = router;