const {Router}=require('express');
const {getBodega,getOneBodega, createBodega, deleteBodega, updateBodega } = require('../controller/bodega.controller');
const {authJwt}=require('../middlewares');
const router=Router();

/**
 * @swagger
 * /api/bodega:
 *   get:
 *     summary: Obtiene todas las bodegas activas
 *     tags: [Bodega]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *     responses:
 *       200:
 *         description: Lista de todas las bodegas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener bodegas
 */
router.get('/',[authJwt.verifyToken],getBodega);

/**
 * @swagger
 * /api/bodega/{idBodega}:
 *   get:
 *     summary: Obtiene una bodega activa por su ID
 *     tags: [Bodega]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: idBodega
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la bodega a buscar
 *     responses:
 *       200:
 *         description: Bodega encontrada
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: No se encontró ninguna bodega con ese ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontró ninguna bodega con ese ID
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener bodega
 */
router.get('/:bodegaId',[authJwt.verifyToken],getOneBodega);

/**
 * @swagger
 * /api/bodega:
 *   post:
 *     summary: Crea un nuevo registro de Bodega
 *     tags: 
 *       - Bodega
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *     requestBody:
 *       description: Objeto JSON que contiene los datos de la Bodega
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bodegaId:
 *                 type: string
 *                 description: ID único de la Bodega
 *               cantidad:
 *                 type: number
 *                 description: Cantidad total de productos en la Bodega
 *               movimientos:
 *                 type: array
 *                 description: Lista de los movimientos realizados en la Bodega
 *     responses:
 *       '201':
 *         description: Registro de Bodega creado exitosamente
 *       '400':
 *         description: Parámetros inválidos proporcionados en la solicitud
 *       '500':
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
router.post('/',[authJwt.verifyToken,authJwt.isAdmin],createBodega);

/**
 * @swagger
 * /api/bodega/{bodegaId}:
 *   put:
 *     summary: Actualiza la cantidad de una bodega específica.
 *     tags:
 *       - Bodega
 *     description: Permite actualizar la cantidad y los movimientos de una bodega en particular.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *       - in: path
 *         name: bodegaId
 *         schema:
 *           type: string
 *         required: true
 *         description: Identificador único de la bodega que se desea actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *                 minimum: 0
 *                 description: Cantidad a actualizar en la bodega.
 *               movimientos:
 *                 type: array
 *                 description: Lista de movimientos a actualizar en la bodega.
 *     responses:
 *       200:
 *         description: La bodega ha sido actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: No se encontró ninguna bodega con ese ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:bodegaId',[authJwt.verifyToken],updateBodega);

/**
 * @openapi
 * 
 * /api/bodega/{idBodega}:
 *   delete:
 *     summary: Elimina un registro de bodega existente.
 *     tags: [Bodega]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: idBodega
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de bodega a eliminar.
 *     responses:
 *       200:
 *         description: Registro de bodega eliminado exitosamente.
 *       404:
 *         description: No se encontró ningún registro de bodega con ese ID de bodega.
 */
router.delete('/:bodegaId',[authJwt.verifyToken,authJwt.isAdmin],deleteBodega);  

module.exports=router;