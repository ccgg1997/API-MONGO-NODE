const {Router} = require('express');
const {getPersona,getOnePersona, createPersona, deletePersona, updatePersona } = require('../controller/persona.controller');
const {authJwt} = require('../middlewares');
const router = Router();


/**
 * @swagger
 * /api/persona:
 *   get:
 *     tags: [Personas]
 *     summary: Obtener todas las personas activas
 *     description: Devuelve un arreglo con todas las personas activas.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *     responses:
 *       '200':
 *         description: Arreglo con las personas activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Persona'
 *       '500':
 *         description: Error al obtener las personas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las personas.
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         personaId:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: 'Nombre de prueba'
 *         apellido:
 *           type: string
 *           example: 'Apellido de prueba'
 *         telefono:
 *           type: string
 *           example: '123456789'
 *         direccion:
 *           type: string
 *           example: 'Dirección de prueba'
 *         activo:
 *           type: boolean
 *           example: true
 *         barrio:
 *           type: string
 *           example: 'Barrio de prueba'
 *         fechaEliminacion:
 *           type: string
 *           format: date-time
 *           example: '2023-06-07T12:00:00Z'
 *         adicional:
 *           type: string
 *           default: null
 */
router.get('/',[authJwt.verifyToken],getPersona);

/**
 * @swagger
 * /api/persona:
 *   post:
 *     tags: [Personas]
 *     summary: Crear una nueva persona
 *     description: Crea una nueva persona con los datos proporcionados.
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
 *               personaId:
 *                 type: string
 *                 example: '12345'
 *               nombre:
 *                 type: string
 *                 example: 'Nombre de prueba'
 *               apellido:
 *                 type: string
 *                 example: 'Apellido de prueba'
 *               telefono:
 *                 type: string
 *                 example: '123456789'
 *               direccion:
 *                 type: string
 *                 example: 'Dirección de prueba'
 *               barrio:
 *                 type: string
 *                 example: 'Barrio de prueba'
 *             required:
 *               - personaId
 *               - nombre
 *               - apellido
 *               - telefono
 *               - direccion
 *               - barrio
 *     responses:
 *       '200':
 *         description: Persona creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Persona creada exitosamente.
 *       '400':
 *         description: Error al crear la persona.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   example: { "message": "Error al crear la persona." }
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         personaId:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: 'Nombre de prueba'
 *         apellido:
 *           type: string
 *           example: 'Apellido de prueba'
 *         telefono:
 *           type: string
 *           example: '123456789'
 *         direccion:
 *           type: string
 *           example: 'Dirección de prueba'
 *         barrio:
 *           type: string
 *           example: 'Barrio de prueba'
 */
router.post('/',[authJwt.verifyToken],createPersona);

/**
 * @swagger
 * /api/persona/{personaId}:
 *   put:
 *     tags: [Personas]
 *     summary: Actualizar una persona por personaId
 *     description: Actualiza los datos de una persona existente identificada por su personaId.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *       - in: path
 *         name: personaId
 *         description: ID de la persona a actualizar
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
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               barrio:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Persona actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Error al actualizar la persona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put('/:personaId',[authJwt.verifyToken],updatePersona);

/**
 * @swagger
 * /api/persona/{personaId}:
 *   delete:
 *     tags: [Personas]
 *     summary: Eliminar una persona por personaId
 *     description: Desactiva una persona existente identificada por su personaId y establece la fecha de eliminación.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de acceso a la API.
 *       - in: path
 *         name: personaId
 *         description: ID de la persona a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Persona eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Error al eliminar la persona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/:personaId',[authJwt.verifyToken],deletePersona);

module.exports = router;