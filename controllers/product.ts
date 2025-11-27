import { Request, Response } from "express";

type Product = {
  id: string,
  name: string,
  price: number,
};

const products: Product[] = [];

export const getProducts = (req: Request, res: Response) => {
  res.header("Content-Type", "application/json");
  res.send(products);
};



export const getProduct = (req: Request, res: Response) => {
  const id = req.params.id;
  const product = products.find((product) => product.id === id);
  if (product) {
    res.header("Content-Type", "application/json");
    res.send(product);
  } else {
    res.status(404).send("Product not found");
  }
};

export const createProduct = (req: Request, res: Response) => {
  const { id, name, price } = req.body;
  if (!id || !name || !price) {
    res.status(400).send("Missing product information");
  }
  //@ts-ignore
  const newProduct: Product = { id, name, price };
  products.push(newProduct);
  res.status(201).send(newProduct);
};


export const updateProduct = (req: Request<Product>, res: Response) => {
  const id = req.params.id;
  const { name, price } = req.body;
  console.log(id, products);
  const product = products.find((product) => product.id.toString() === id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    res.send(product);
  } else {
    res.status(404).send("Product not found");
  }
};


export const deleteProduct = (req: Request, res: Response) => {
  const id = req.params.id;
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found");
  }
};