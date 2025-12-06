import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import {Product} from "../models/product"
import { getProductsSchema } from "../validators/getProductSchema";
import { Equal, Like } from "typeorm";


const productRepository = AppDataSource.getRepository(Product); 

// export const getProducts = async (req: Request, res: Response) => {
//   try {
//     const allProducts = await productRepository.find();
//     res.json(allProducts);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      query: {
        page = 1,
        perPage = 10,
        sortBy = "createdAt",
        sortDir = "desc",
        filterBy,
        query,
      },
    } = await getProductsSchema.parseAsync(req);

    const skip = (page - 1) * perPage;
    const take = perPage;

    const order: Record<string, "asc" | "desc"> = {
      [sortBy]: sortDir.toUpperCase() === "asc" ? "asc" : "desc",
    };

    let where = {};
    if (filterBy && query) {
      switch (filterBy) {
        case "name":
          where = { name: Like(`%${query}%`) };
          break;
        case "price":
          where = { price: Equal(parseFloat(query)) };
          break;
        default:
          where = {};
      }
    }

    const totalItems = await productRepository.count({ where });

    const products = await productRepository.find({ skip, take, where, order });

    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPreviousPage ? page - 1 : null;
    const lastPage = totalPages;

    res.json({
      data: products,
      page,
      perPage,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      prevPage,
      lastPage,
    });
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