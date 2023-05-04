const {Router}=require('express');
const { getProduct, createProduct,deleteProduct,getOneProduct,updateProduct,updateProductBodega,updatePrecioProducto } = require('../controller/product.controller');
const {authJwt}=require('../middlewares');
const router=Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retorna una lista de productos
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *       
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del producto
 *                   producto_id:
 *                     type: string
 *                     description: Identificador del producto
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                   precio_regular:
 *                     type: number
 *                     description: Precio regular del producto
 *                   precio_especial:
 *                     type: array
 *                     description: Precios especiales para cada cliente
 *                     items:
 *                       type: object
 *                       properties:
 *                         cliente_id:
 *                           type: string
 *                           description: ID del cliente con precio especial
 *                         precio:
 *                           type: number
 *                           description: Precio especial para el cliente
 *                   familia_id:
 *                     type: string
 *                     description: ID de la familia a la que pertenece el producto
 *                   activo:
 *                     type: boolean
 *                     description: Indica si el producto está activo o no
 *       400:
 *         description: Error al obtener la lista de productos
 */
router.get('/',authJwt.verifyToken, getProduct);

/**
 * @swagger
 * /api/products/{producto_id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtiene un producto por su ID.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint       
 *       - in: path
 *         name: producto_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto a buscar.
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: id no existe
 *                 producto_id:
 *                   type: string
 *                   example: P001
 */
router.get('/:producto_id',[authJwt.verifyToken,authJwt.isAdmin],getOneProduct);

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del producto
 *         producto_id:
 *           type: string
 *           description: Identificador del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         precio_regular:
 *           type: number
 *           description: Precio regular del producto
 *         precio_especial:
 *           type: array
 *           description: Precios especiales para cada cliente
 *           items:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 description: ID del cliente con precio especial
 *               precio:
 *                 type: number
 *                 description: Precio especial para el cliente
 *         familia_id:
 *           type: string
 *           description: ID de la familia a la que pertenece el producto
 *         activo:
 *           type: boolean
 *           description: Indica si el producto está activo o no
 *         bodegas:
 *           type: array
 *           description: Lista de bodegas del producto
 *           items:
 *             type: object
 *             properties:
 *               nombreBodega:
 *                 type: string
 *                 description: Nombre de la bodega
 *               cantidad:
 *                 type: number
 *                 description: Cantidad en la bodega
 *                 minimum: 0
 *         cantidadTotal:
 *           type: number
 *           description: Cantidad total del producto en todas las bodegas
 *           minimum: 0
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 *     JwtToken:
 *       type: string
 *       description: Token de autenticación JWT
 *
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Crea un nuevo producto
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           $ref: '#/components/schemas/JwtToken'
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Error de validación de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/',[authJwt.verifyToken],createProduct);

/**
 * @openapi
 * /api/products/{producto_id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Elimina un producto de la base de datos.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticación JWT para acceder al endpoint 
 *       - in: path
 *         name: producto_id
 *         description: ID del producto a eliminar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: El producto se eliminó correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                   description: Número de documentos que se actualizaron.
 *                 nModified:
 *                   type: number
 *                   description: Número de documentos que se modificaron.
 *                 ok:
 *                   type: number
 *                   description: Indica si la operación se completó correctamente.
 *       400:
 *         description: No se proporcionó el ID del producto o el ID proporcionado es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *       500:
 *         description: Hubo un error al eliminar el producto de la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 */
router.delete('/:producto_id',[authJwt.verifyToken,authJwt.isAdmin],deleteProduct);

/**
 * @swagger
 * /api/products/{producto_id}:
 *   put:
 *     summary: Modificar producto por producto_id
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: producto_id
 *         description: ID del producto a modificar
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
 *               precio_regular:
 *                 type: number
 *               precio_especial:
 *                 type: number
 *               familia_id:
 *                 type: string
 *               bodegas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombreBodega:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                       minimum: 0
 *               cantidadTotal:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Producto modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                 nModified:
 *                   type: number
 *                 ok:
 *                   type: number
 *       400:
 *         description: El producto no pudo ser modificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:producto_id',[authJwt.verifyToken],updateProduct);

/**
 * @swagger
 * /api/products/productBodega/{producto_id}:
 *   put:
 *     summary: Modificar cantidad del producto en bodega especifica
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: producto_id
 *         description: ID del producto a modificar
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
 *               bodega:
 *                 type: string
 *               cantidad:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Producto modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                 nModified:
 *                   type: number
 *                 ok:
 *                   type: number
 *       400:
 *         description: El producto no pudo ser modificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/productBodega/:producto_id',[authJwt.verifyToken],updateProductBodega);

/**
 * @swagger
 * /api/products/precioEspecialProd/{producto_id}:
 *   put:
 *     summary: Modificar el precio especial del producto en cliente especifico
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *       - in: path
 *         name: producto_id
 *         description: ID del producto a modificar
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
 *               cliente_id:
 *                 type: string
 *               precio:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Producto modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 n:
 *                   type: number
 *                 nModified:
 *                   type: number
 *                 ok:
 *                   type: number
 *       400:
 *         description: El producto no pudo ser modificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/precioEspecialProd/:producto_id',[authJwt.verifyToken],updatePrecioProducto);
module.exports = router;