const {Router}=require('express');
const { getProduct, createProduct,deleteProduct,getOneProduct,updateProduct,updateProductBodega,updatePrecioProducto } = require('../controller/product.controller');
const {authJwt}=require('../middlewares');
const router=Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Obtener todos los productos activos
 *     description: Devuelve un arreglo con todos los productos activos.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token de acceso a la API.
 *     responses:
 *       '200':
 *         description: Arreglo con los productos activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error al obtener los productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los productos.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         producto_id:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: 'Producto de prueba'
 *         precio_regular:
 *           type: number
 *           example: 10.99
 *         precio_especial:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 example: '54321'
 *               precio:
 *                 type: number
 *                 example: 9.99
 *         familia_id:
 *           type: string
 *           example: 'Familia 1'
 *         activo:
 *           type: boolean
 *           example: true
 *         bodegas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombreBodega:
 *                 type: string
 *                 example: 'Bodega 1'
 *               cantidad:
 *                 type: number
 *                 example: 10
 *         cantidadTotal:
 *           type: number
 *           example: 50
 */
router.get('/',authJwt.verifyToken, getProduct);

/**
 * @swagger
 * /api/products/{producto_id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener un producto por su ID
 *     description: Devuelve un producto que coincida con el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         description: ID del producto a buscar.
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token de acceso a la API.
 *     responses:
 *       '200':
 *         description: Objeto con el producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
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
 *                   example: '12345'
 *       '500':
 *         description: Error al obtener el producto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el producto.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         producto_id:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: 'Producto de prueba'
 *         precio_regular:
 *           type: number
 *           example: 10.99
 *         precio_especial:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 example: '54321'
 *               precio:
 *                 type: number
 *                 example: 9.99
 *         familia_id:
 *           type: string
 *           example: 'Familia 1'
 *         activo:
 *           type: boolean
 *           example: true
 *         bodegas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombreBodega:
 *                 type: string
 *                 example: 'Bodega 1'
 *               cantidad:
 *                 type: number
 *                 example: 10
 *         cantidadTotal:
 *           type: number
 *           example: 50
 */
router.get('/:producto_id',[authJwt.verifyToken],getOneProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto con los datos proporcionados.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: Token de acceso a la API.
 *     requestBody:
 *       description: Datos del producto a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: string
 *                 example: '12345'
 *               nombre:
 *                 type: string
 *                 example: 'Producto de prueba'
 *               precio_regular:
 *                 type: number
 *                 example: 10.99
 *               precio_especial:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cliente_id:
 *                       type: string
 *                       example: '54321'
 *                     precio:
 *                       type: number
 *                       example: 9.99
 *               familia_id:
 *                 type: string
 *                 example: 'Familia 1'
 *               activo:
 *                 type: boolean
 *                 example: true
 *               bodegas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombreBodega:
 *                       type: string
 *                       example: 'Bodega 1'
 *                     cantidad:
 *                       type: number
 *                       example: 10
 *               cantidadTotal:
 *                 type: number
 *                 example: 50
 *     responses:
 *       '200':
 *         description: Objeto con el producto creado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Error al crear el producto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el producto.
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         producto_id:
 *           type: string
 *           example: '12345'
 *         nombre:
 *           type: string
 *           example: 'Producto de prueba'
 *         precio_regular:
 *           type: number
 *           example: 10.99
 *         precio_especial:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: string
 *                 example: '54321'
 *               precio:
 *                 type: number
 *                 example: 9.99
 *         familia_id:
 *           type: string
 *           example: 'Familia 1'
 *         activo:
 *           type: boolean
 *           example: true
 *         bodegas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nombreBodega:
 *                 type: string
 *                 example: 'Bodega 1'
 *               cantidad:
 *                 type: number
 *                 example: 10
 *         cantidadTotal:
 *           type: number
 *           example: 50
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
router.delete('/:producto_id',[authJwt.verifyToken],deleteProduct);

/**
 * @swagger
 * /api/products/{producto_id}:
 *   put:
 *     summary: Modificar producto por producto_id
 *     tags:
 *       - Products
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