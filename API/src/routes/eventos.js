const { Router } = require('express');
const { authJwt } = require('../middlewares');
const router = Router();
const { getEventos, createEvento, deleteEvento } = require('../controller/eventos.controller');


/**
 * @swagger
 * /api/eventos:
 *   get:
 *     summary: Obtiene todos los eventos.
 *     description: Retorna una lista de todos los eventos registrados.
 *     tags: [Evento]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         type: string
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida correctamente.
 *         content:
 *           application/json:
 *             example:
 *               - title: Evento 1
 *                 start: "2023-08-18"
 *               - title: Evento 2
 *                 start: "2023-08-19"
 */
router.get('/',[authJwt.verifyToken], getEventos);

/**
 * @swagger
 * /api/eventos:
 *   post:
 *     summary: Crea un nuevo evento.
 *     description: Crea un nuevo evento con el título y la fecha especificados.
 *     tags: [Evento]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               start:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               title: Evento 3
 *               start: "2023-08-20"
 *       400:
 *         description: Ya existe un evento con el mismo identificador.
 *       500:
 *         description: Error al crear el evento.
 */
router.post('/',[authJwt.verifyToken], createEvento);

/**
 * @swagger
 * /api/eventos/{identificador}:
 *   delete:
 *     summary: Elimina un evento por identificador.
 *     description: Elimina un evento utilizando su identificador único.
 *     tags: [Evento]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token de autenticación JWT.
 *         type: string
 *       - in: path
 *         name: identificador
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del evento a eliminar.
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               title: Evento eliminado
 *               start: "2023-08-18"
 *       404:
 *         description: Evento no encontrado.
 *       500:
 *         description: Error al eliminar el evento.
 */
router.delete('/:identificador',[authJwt.verifyToken], deleteEvento);

module.exports = router;  
