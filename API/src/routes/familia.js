const { Router } = require('express');
const { getFamilia,getOneFamilia, createFamilia,deleteFamilia} = require('../controller/familia.controller');
const { authJwt } = require('../middlewares');
const router = Router();

/**
 * @openapi
 * /api/familia:
 *   get:
 *     tags: 
 *       - Familia
 *     summary: Retornar familias
 *     description: Crea una nueva familia en el sistema.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Familias consultadas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la familia
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la familia
 *                 activo:
 *                   type: boolean
 *                   description: Indica si la familia está activa o no
 *                 estilos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del estilo
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error.
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
router.get('/', [authJwt.verifyToken], getFamilia);

/**
 * @swagger
 * /api/familia/{id}:
 *   get:
 *     tags:
 *       - Familia
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         required: true
 *         type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la familia a buscar
 *     summary: Obtener una familia por ID
 *     description: Endpoint que devuelve una familia específica en el sistema, identificada por su ID
 *     responses:
 *       200:
 *         description: Familia encontrada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la familia
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la familia
 *                 activo:
 *                   type: boolean
 *                   description: Indica si la familia está activa o no
 *                 estilos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del estilo de la familia
 *       404:
 *         description: Familia no encontrada
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
router.get('/:nombre', [authJwt.verifyToken], getOneFamilia);

/**
 * @swagger
 * /api/familia:
 *   post:
 *     tags:
 *       - Familia
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
 *               nombre:
 *                 type: string
 *                 description: Nombre de la familia
 *               estilos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: Nombre del estilo
 *             example:
 *               nombre: "Ropa de deporte"
 *               estilos: [
 *                 { nombre: "Pantalones" },
 *                 { nombre: "Camisetas" }
 *               ]
 *     summary: Crear una nueva familia
 *     description: Endpoint que permite crear una nueva familia en el sistema.
 *     responses:
 *       201:
 *         description: Familia creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la familia creada
 *                 nombre:
 *                   type: string
 *                   description: Nombre de la familia creada
 *                 estilos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del estilo
 *       400:
 *         description: Datos de entrada inválidos
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
 */
router.post('/', [authJwt.verifyToken], createFamilia);

/**
 * @swagger
 * /api/familia/{id}:
 *   delete:
 *     tags:
 *       - Familia
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la familia a eliminar
 *     summary: Eliminar una familia por ID
 *     description: Endpoint que elimina una familia específica en el sistema, identificada por su ID
 *     responses:
 *       204:
 *         description: Familia eliminada con éxito
 *       404:
 *         description: Familia no encontrada
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
router.delete('/:nombre', [authJwt.verifyToken], deleteFamilia);

module.exports = router;
