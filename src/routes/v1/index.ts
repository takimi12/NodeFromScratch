import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../../controllers/product";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../controllers/authController";

import { AuthRequest, verifyToken } from "../../middlewares/isAuth";

import { getUserCart } from "../../controllers/cart";

const router = Router();

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
router.get("/product", getProducts);
router.get("/product/:id", getProduct);

//
// ======================
// PRODUCTS – chronione
// ======================
router.post("/product", verifyToken, createProduct);
router.put("/product/:id", verifyToken, updateProduct);
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
