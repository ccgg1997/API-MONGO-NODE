const {Router}=require('express');
const router=Router();

/**
 * @openapi
 * /api/users/signin:
 *   get:
 *    tags:
 *     - Products
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
router.get('/',(req,res)=>{
  res.send('products');
});







module.exports = router;