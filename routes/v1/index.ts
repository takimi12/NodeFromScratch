import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../../src/controllers/product";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../src/controllers/authController";

import { AuthRequest, verifyToken } from "../../src/middlewares/isAuth";

import { getUserCart } from "../../src/controllers/cart";

const router = Router();

//
// ======================
// SWAGGER COMPONENTS – definicja schematu Product
// ======================

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product price
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 *         deletedAt:
 *           type: string
 *           format: date
 *           nullable: true
 *         cartId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the cart this product belongs to (if any)
 *       example:
 *         id: d5fE_asz
 *         name: Product 1
 *         description: test
 *         price: 1
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 *         deletedAt: null
 *         cartId: d5fE_asz
 */

//
// ======================
// AUTH – endpointy publiczne
// ======================
router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);
router.post("/logout", logoutUser);

//
// ======================
// PRODUCTS – publiczne
// ======================
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get products with filtering, sorting and pagination
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: filterBy
 *         schema:
 *           type: string
 *           enum: [name, price]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPreviousPage:
 *                   type: boolean
 *                 nextPage:
 *                   type: integer
 *                   nullable: true
 *                 prevPage:
 *                   type: integer
 *                   nullable: true
 *                 lastPage:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/products", getProducts);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the product
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Some server error
 */
router.get("/product/:id", getProduct);

//
// ======================
// PRODUCTS – chronione
// ======================

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing product information
 *       500:
 *         description: Server error
 */
router.post("/product", verifyToken, createProduct);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               cartId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/product/:id", verifyToken, updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID of the product to delete
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/product/:id", verifyToken, deleteProduct);

//
// ======================
// CART – chronione
// ======================
router.get("/cart", verifyToken, getUserCart);

//
// ======================
// SECURE DATA – przykład endpointu chronionego
// ======================
router.get("/secure-data", verifyToken, (req: AuthRequest, res) => {
  res.json({
    message: "Dane tylko dla zalogowanych użytkowników",
    user: req.user,
  });
});

export default router;
