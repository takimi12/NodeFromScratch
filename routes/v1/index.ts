import { Router, Request } from "express";
const router = Router();

type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [];

/**
 * READ – pobranie wszystkich produktów
 */
router.get("/product", (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(products);
});

/**
 * READ – pobranie jednego produktu po ID
 */
router.get("/product/:id", (req, res) => {
  const id = req.params.id;
  const product = products.find((product) => product.id === id);

  if (product) {
    res.header("Content-Type", "application/json");
    res.send(product);
  } else {
    res.status(404).send("Product not found");
  }
});

/**
 * CREATE – dodawanie produktu
 * (dane przychodzą przez query dla uproszczenia)
 */
router.post("/product", (req, res): void => {
  const { id, name, price } = req.query;

  if (!id || !name || !price) {
    res.status(400).send("Missing product information");
    return;
  }

  // @ts-ignore – bo query jest typu string | undefined
  const newProduct: Product = { id, name, price };
  products.push(newProduct);

  res.status(201).send(newProduct);
});

/**
 * UPDATE – aktualizacja produktu
 * (dane także pobierane przez query)
 */
router.put("/product/:id", (req: Request, res) => {
  const id = req.params.id;
  const { name, price } = req.query;

  const product = products.find((product) => product.id === id);

  if (product) {
    if (name) product.name = String(name);
    if (price) product.price = Number(price);

    res.send(product);
  } else {
    res.status(404).send("Product not found");
  }
});

/**
 * DELETE – usuwanie produktu po ID
 */
router.delete("/product/:id", (req, res) => {
  const id = req.params.id;
  const index = products.findIndex((product) => product.id === id);

  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found");
  }
});

export default router;
