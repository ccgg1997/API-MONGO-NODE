const {Router} = require('express');
const {getNegocio,getOneNegocio, createNegocio, deleteNegocio, updateNegocio } = require('../controller/negocio.controller');
const {authJwt} = require('../middlewares');
const router = Router();

/**
 * @swagger
 * /api/negocio:
 *   get:
 *     tags:
 *       - Negocios
 *     summary: Obtener todos los negocios
 *     description: Endpoint que devuelve una lista de todos los negocios en el sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de negocios recuperada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del negocio
 *                   nombre:
 *                     type: string
 *                     description: Nombre de usuario del usuario
 *                   duenio:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                   direccion:
 *                     type: string
 *                     description: Dirección del negocio 
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del negocio
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el negocio está activo o no
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
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
router.get('/',[authJwt.verifyToken],getNegocio);

/**
 * @swagger
 * /api/negocio/{id}:
 *   get:
 *     tags:
 *      - Negocios
 *     summary: Obtener un negocio por su ID
 *     description: Endpoint que permite obtener un negocio por su ID
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del negocio a obtener
 *         
 *     responses:
 *       200:
 *         description: Negocio obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del negocio
 *                   nombre:
 *                     type: string
 *                     description: Nombre de usuario del usuario
 *                   duenio:
 *                     type: string
 *                     description: Correo electrónico del usuario
 *                   direccion:
 *                     type: string
 *                     description: Dirección del negocio 
 *                   telefono:
 *                     type: string
 *                     description: Teléfono del negocio
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el negocio está activo o no
 *       404:        
 *         description: Negocio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
router.get('/:id',[authJwt.verifyToken],getOneNegocio);

/**
 * @swagger
 * /api/negocios:
 *   post:
 *     summary: Crea un nuevo registro de negocio
 *     tags: 
 *       - Negocios
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *     requestBody:
 *       description: Objeto JSON que contiene los datos del Negocio a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del negocio
 *               negocio:
 *                 type: string
 *                 description: Nombre del negocio
 *               duenio:
 *                 type: string
 *                 description: nombre del dueño del negocio
 *               direccion:
 *                 type: string
 *                 description: Dirección del negocio 
 *               telefono:
 *                 type: string
 *                 description: Teléfono del negocio
 *               barrio:
 *                 type: string
 *                 description: Barrio del negocio
 *     responses:
 *       '201':
 *         description: Registro de Negocio creado con éxito
 *       '400':
 *         description: Parámetros inválidos proporcionados en la solicitud
 *       '500':
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
router.post('/',[authJwt.verifyToken,authJwt.isAdmin],createNegocio);

/**
 * @swagger
 * /api/negocio/{id}:
 *   put:
 *     tags:
 *       - Negocios
 *     summary: Actualizar un negocio existente
 *     description: Endpoint que actualiza los datos de un unegocio existente en el sistema
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del negocio a actualizar
 *     requestBody:
 *       description: Datos del negocio a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               negocio:
 *                 type: string
 *                 description: Nombre del negocio
 *               duenio:
 *                 type: string
 *                 description: duenio del negocio
 *               direccion:
 *                 type: string
 *                 description: direccion del negocio
 *               telefono:
 *                 type: string
 *                 description: telefono del negocio
 *               barrio:
 *                 type: string
 *                 description: barrio del negocio
 *               active:
 *                 type: boolean
 *                 description: Indica si el negocio fue eliminado o no
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   description: Número de documentos modificados
 *                 nModified:
 *                   type: number
 *                   description: Número de documentos modificados correctamente
 *                 ok:
 *                   type: number
 *                   description: Indica si la operación fue exitosa (1) o no (0)
 *       400:
 *         description: Error en los parámetros de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *       401:
 *         description: Error de autenticación
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
router.post('/:id',[authJwt.verifyToken,authJwt.isAdmin],updateNegocio);

/**
 * @swagger
 * /api/negocio/{id}:
 *   delete:
 *     tags:
 *      - Negocios
 *     summary: Eliminar un negocio
 *     description: Endpoint para eliminar un negocio existente en el sistema
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *       - in: path
 *         id: id
 *         required: true
 *         description: identificador del negocio a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Negocio eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   description: Número de documentos afectados
 *                 ok:
 *                   type: number
 *                   description: Indicador de éxito de la operación
 *       404:
 *         description: Negocio no encontrado
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
router.post('/:id',[authJwt.verifyToken,authJwt.isAdmin],deleteNegocio)
module.exports = router;