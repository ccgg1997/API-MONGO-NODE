const {Router}=require('express');
const router=Router();
const{signUp,signIn,createUser,getUser,getOneUser,updateUser,deleteUser}=require('../controller/user.controller');
const {verifySignUp,authJwt}=require('../middlewares');
//create user


/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     tags:
 *      - Users
 *     summary: Crear un usuario  
 *     description: Endpoint que permite crear un usuario con su ID,contrasenia y demas datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               id:
 *                 type: string
 *                 description: ID del usuario
 *               roles:
 *                 type: array
 *                 description: Roles del usuario
 *     responses:
 *       200:
 *         description: Token de autenticación generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado
 *       400:
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *                 token:
 *                   type: null
 */
router.post('/signup',
[verifySignUp.checkDuplicateId,verifySignUp.checkRolesExisted],
signUp);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     tags:
 *      - Users
 *     summary: Autenticar un usuario
 *     description: Endpoint que permite autenticar un usuario con su ID y su contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del usuario
 *                 example: 99
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Token de autenticación generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado
 *       400:
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 *                 token:
 *                   type: null
 */
router.post('/signin',signIn);
//router.post('/', createUser); 

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener todos los usuarios
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *     description: Endpoint que devuelve una lista de todos los usuarios en el sistema
 *     responses:
 *       200:
 *         description: Lista de usuarios recuperada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del usuario
 *                   username:
 *                     type: string
 *                     description: Nombre de usuario del usuario
 *                   email:
 *                     type: string
 *                     description: Correo electrónico del usuario
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
router.get('/', getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *      - Users
 *     summary: Obtener un usuario por su ID
 *     description: Endpoint que permite obtener un usuario por su ID
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a obtener
 *         
 *     responses:
 *       200:
 *         description: Usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del usuario
 *                 id:
 *                   type: string
 *                   description: ID del usuario
 *                 username:
 *                   type: string
 *                   description: Nombre de usuario
 *                 email:
 *                   type: string
 *                   description: Correo electrónico
 *                 access:
 *                   type: boolean
 *                   description: Indica si el usuario tiene acceso o no
 *       404:        
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
router.get('/:id',authJwt.verifyToken,getOneUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar un usuario existente
 *     description: Endpoint que actualiza los datos de un usuario existente en el sistema
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       description: Datos del usuario a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               rol:
 *                 type: string
 *                 description: Rol del usuario
 *               deleted:
 *                 type: boolean
 *                 description: Indica si el usuario fue eliminado o no
 *               access:
 *                 type: boolean
 *                 description: Indica si el usuario tiene acceso o no
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
router.put('/:id',[authJwt.verifyToken,authJwt.isAdmin,updateUser]);


/**
 * @swagger
 * /api/users/{cedula}:
 *   delete:
 *     tags:
 *      - Users
 *     summary: Eliminar un usuario
 *     description: Endpoint para eliminar un usuario existente en el sistema
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         description: Token de autenticación JWT para acceder al endpoint
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
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
 *         description: Usuario no encontrado
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
router.delete('/:id',[authJwt.verifyToken, authJwt.isAdmin ,deleteUser]);


module.exports = router;