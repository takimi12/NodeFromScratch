import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import {Product} from "../models/product"


const productRepository = AppDataSource.getRepository(Product); 

export const getProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await productRepository.find();
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).json({ message: "Invalid product ID" });

    const product = await productRepository.findOneBy({ id }); 
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const createProduct = (req: Request, res: Response) => {
//   const { id, name, price } = req.body;
//   if (!id || !name || !price) {
//     res.status(400).send("Missing product information");
//   }
//   //@ts-ignore
//   const newProduct: Product = { id, name, price };
//   products.push(newProduct);
//   res.status(201).send(newProduct);
// };
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    if (!name || !price)
      res.status(400).json({ message: "Missing product information" }); // prymitywna walidacja

    const newProduct = productRepository.create({ name, price }); //tworzenie obiektu na repozytorium
    await productRepository.save(newProduct); //zapis obiektu na repozytorium

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const updateProduct = (req: Request<Product>, res: Response) => {
//   const id = req.params.id;
//   const { name, price } = req.body;
//   console.log(id, products);
//   const product = products.find((product) => product.id.toString() === id);
//   if (product) {
//     product.name = name || product.name;
//     product.price = price || product.price;
//     res.send(product);
//   } else {
//     res.status(404).send("Product not found");
//   }
// };
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Invalid product ID" });
    }

    const { name, price, description } = req.body;
    const product = await productRepository.findOneBy({ id }); // pobieramy istniejący produkt

    if (product) {
      // zmieniamy jego pola na nowe wartości
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      const updatedProduct = await productRepository.save(product); //zapisujemy do bazy

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const deleteProduct = (req: Request, res: Response) => {
//   const id = req.params.id;
//   const productIndex = products.findIndex((product) => product.id === id);
//   if (productIndex !== -1) {
//     products.splice(productIndex, 1);
//     res.status(204).send();
//   } else {
//     res.status(404).send("Product not found");
//   }
// };
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Invalid product ID" });
    }

    const result = await productRepository.softDelete(id); // używamy softDelete, żeby zachować rekord w bazie danych

    if (!result.affected) {
      res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};