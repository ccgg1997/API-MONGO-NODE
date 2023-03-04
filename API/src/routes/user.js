const {Router}=require('express');
const router=Router();
const{signUp,signIn,createUser,getUser,getOneUser,updateUser,deleteUser}=require('../controller/user.controller');
const {verifySignUp,authJwt}=require('../middlewares');
//create user

/**
 * @openapi
 * /api/users/signup:
 *   get:
 *    tags:
 *     - Users
 *    description: registra un usuario en el sistema
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           password:
 *            type: string
 *            description: password del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.post('/signup',
[verifySignUp.checkDuplicateId,verifySignUp.checkRolesExisted],
signUp);

/**
 * @openapi
 * /api/users/signin:
 *   get:
 *    tags:
 *     - Users
 *    description: trae todo los usuarios del sistema
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           password:
 *            type: string
 *            description: password del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.post('/signin',signIn);
//router.post('/', createUser); 

/**
 * @openapi
 * /api/users/:
 *   get:
 *    tags:
 *     - Users
 *    description: trae todo los usuarios del sistema
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.get('/',authJwt.verifyToken, getUser);

/**
 * @openapi
 * /api/users/id:
 *   get:
 *    tags:
 *     - Users
 *    description: trae un usuario del sistema por id
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.get('/:id',getOneUser);

/**
 * @openapi
 * /api/users/id:
 *   put:
 *    tags:
 *     - Users
 *    description: actualiza un usuario del sistema por id
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.put('/:id' ,updateUser);

/**
 * @openapi
 * /api/users/id:
 *   delete:
 *    tags:
 *     - Users
 *    description: elimina un usuario del sistema por id
 *    responses:
 *     200:
 *       description: OK
 *       content: 
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description: id del usuario
 *           data:
 *            type: array
 *            items:
 *             type: object
 *            responses:
 *            400:
 *            description: Error de validación de entrada
 */
router.delete('/:id', deleteUser);


module.exports = router;