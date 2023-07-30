const {Router} = require('express');
const {getProduccion,getOneProduccion, createProduccion, deleteProduccion, updateProduccion,recibirMaterial,movEntreBodegas } = require('../controller/produccion.controller');
const {authJwt} = require('../middlewares');
const router = Router();

/**
 * @swagger
 * /api/produccion:
 *   get:
 *     tags: [Produccion]
 *     summary: Obtener todas las producciones activas
 *     description: Devuelve un arreglo con todas las producciones activas.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *     responses:
 *       '200':
 *         description: Arreglo con las producciones activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produccion'
 *       '500':
 *         description: Error al obtener las producciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las producciones.
 * components:
 *   schemas:
 *     Produccion:
 *       type: object
 *       properties:
 *         produccionId:
 *           type: string
 *           example: '12345'
 *         personaId:
 *           type: string
 *           example: '67890'
 *         nombrePersona:
 *           type: string
 *           example: 'Nombre de la persona'
 *         fechaInicial:
 *           type: string
 *           format: date-time
 *           example: '2023-06-07T12:00:00Z'
 *         cantidad:
 *           type: number
 *           example: 10
 *         cantidadEntregada:
 *           type: number
 *           example: 5
 *         activo:
 *           type: boolean
 *           example: true
 *         ultimaFechaEntrega:
 *           type: string
 *           format: date-time
 *           example: '2023-06-07T12:00:00Z'
 *         familiaNombre:
 *           type: string
 *           example: 'Nombre de la familia'
 *         estilos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: 'Estilo 1'
 *               cantidad:
 *                 type: number
 *                 example: 3
 */
router.get('/',[authJwt.verifyToken],getProduccion)

/**
 * @swagger
 * /api/produccion:
 *   post:
 *     tags:
 *       - Produccion
 *     summary: Crear una producción
 *     description: Crea una nueva producción con los datos proporcionados.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *                 example: "z2345"
 *               personaId:
 *                 type: string
 *                 example: "67890"
 *               nombrePersona:
 *                 type: string
 *                 example: "John Doe"
 *               fechaInicial:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-07T12:00:00Z"
 *               cantidad:
 *                 type: integer
 *                 example: 10
 *               familiaNombre:
 *                 type: string
 *                 example: "Familia Ejemplo"
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Estilo 1"
 *                     cantidad:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       '201':
 *         description: Producción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personaId:
 *                   type: string
 *                   example: "67890"
 *                 nombrePersona:
 *                   type: string
 *                   example: "John Doe"
 *                 cantidad:
 *                   type: integer
 *                   example: 10
 *                 familiaNombre:
 *                   type: string
 *                   example: "Familia Ejemplo"
 *                 estilos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Estilo 1"
 *                       cantidad:
 *                         type: integer
 *                         example: 5
 *       '400':
 *         description: Faltan valores o error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/',[authJwt.verifyToken],createProduccion)

/**
 * @swagger
 * /api/produccion/recibirMaterial:
 *   post:
 *     tags:
 *       - Produccion
 *     summary: Recibir material de producción
 *     description: Actualiza la producción con la información de los materiales recibidos.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produccionId:
 *                 type: string
 *               tamanio:
 *                 type: string
 *                 enum: [O, M, 2P]
 *                 example: "O"
 *               productoId:
 *                 type: string
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *             example:
 *               produccionId: "2023-06-08T10:43:47-05:00"
 *               productoId: "XH02"
 *               tamanio: "O"
 *               estilos:
 *                 - nombre: "AMARILLO"
 *                   cantidad: 10
 *     responses:
 *       201:
 *         description: Producción actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       400:
 *         description: Error en la solicitud o producción no encontrada.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               description: Descripción del error.
 */
router.post('/recibirMaterial',[authJwt.verifyToken],recibirMaterial)

/**
 * @swagger
 * /api/produccion/movientrebodega:
 *   post:
 *     tags:
 *       - Produccion
 *     summary: Realizar movimiento entre bodegas
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               bodegaIdActual:
 *                 type: string
 *               bodegaIdFuturo:
 *                 type: string
 *               famila:
 *                 type: string
 *               estilos:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimiento entre bodegas completado
 *       400:
 *         description: Error en la solicitud o faltan valores
 */
router.post('/movientrebodega',[authJwt.verifyToken],movEntreBodegas);




module.exports = router;