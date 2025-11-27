import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../../controllers/product";

const router = Router();

router.get("/product", getProducts);

router.get("/product/:id", getProduct);

router.post("/product", createProduct);

router.put("/product/:id", updateProduct);

router.delete("/product/:id", deleteProduct);

export default router;