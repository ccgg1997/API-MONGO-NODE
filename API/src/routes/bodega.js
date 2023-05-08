const {Router}=require('express');
const {getBodega,getOneBodega, createBodega, deleteBodega } = require('../controller/bodega.controller');
const {authJwt}=require('../middlewares');
const router=Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Bodega:
 *       type: object
 *       properties:
 *         bodegaId:
 *           type: string
 *         bodegaNombre:
 *           type: string
 *         activo:
 *           type: boolean
 *
 * /api/bodega:
 *   get:
 *     summary: Obtiene todas las bodegas activas
 *     tags:
 *       - Bodega
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bodega'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/',[authJwt.verifyToken],getBodega);

/**
 * @openapi
 * components:
 *   schemas:
 *     Bodega:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         bodegaId:
 *           type: string
 *         bodegaNombre:
 *           type: string
 *         activo:
 *           type: boolean
 *
 * /api/bodega/{bodegaId}:
 *   get:
 *     summary: Retorna una Bodega según su ID
 *     description: Retorna una Bodega según su ID
 *     tags:
 *       - Bodega
 *     parameters:
 *       - in: path
 *         name: bodegaId
 *         required: true
 *         description: ID de la Bodega a buscar
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Bodega encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bodega'
 *       '404':
 *         description: No se encontró ninguna Bodega con ese ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/:bodegaId',[authJwt.verifyToken],getOneBodega);

/**
 * @openapi
 * /api/bodega:
 *   post:
 *     summary: Crea un nuevo registro de Bodega.
 *     description: Crea un nuevo registro de Bodega con los datos proporcionados en el cuerpo de la petición.
 *     tags: [Bodega]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bodegaId:
 *                 type: string
 *                 description: Identificador único de la bodega.
 *               bodegaNombre:
 *                 type: string
 *                 description: Nombre de la bodega.
 *             required:
 *               - bodegaId
 *               - bodegaNombre
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *     responses:
 *       '201':
 *         description: Registro de Bodega creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación del registro de Bodega.
 *                   example: Bodega creado exitosamente.
 *       '400':
 *         description: Error de validación de datos del registro de Bodega.
 *       '500':
 *         description: Error interno del servidor al crear el registro de Bodega.
 */
//router.post('/',[authJwt.verifyToken,authJwt.isAdmin],createBodega);
router.post('/',[authJwt.verifyToken],createBodega);

/**
 * @swagger
 * /api/bodega/{bodegaId}:
 *   delete:
 *     summary: Eliminar una bodega por su ID
 *     description: Eliminar una bodega en la base de datos por su ID.
 *     tags:
 *       - Bodega
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: bodegaId
 *         required: true
 *         description: ID de la bodega a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bodega eliminada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 bodegaId:
 *                   type: string
 *                 bodegaNombre:
 *                   type: string
 *                 activo:
 *                   type: boolean
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
router.delete('/:bodegaId',[authJwt.verifyToken,authJwt.isAdmin],deleteBodega);  

module.exports=router;