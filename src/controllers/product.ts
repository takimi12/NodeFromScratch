import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../models/product";
import { getProductsSchema } from "../validators/getProductSchema";
import { Equal, Like } from "typeorm";

import { cache } from "../config/cache";
import { CACHE_KEYS } from "../constants/cacheKeys";
import { redisClient } from "..";

const productRepository = AppDataSource.getRepository(Product);

// =============================
// GET PRODUCTS (with pagination + cache)
// =============================
export const getProducts = async (req: Request, res: Response): Promise<Response> => {
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

    const cacheKey = `${CACHE_KEYS.PRODUCTS}_${page}_${perPage}_${sortBy}_${sortDir}_${filterBy || "none"}_${query || "none"}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      console.log("CACHE HIT: products list");
      return res.json(cached);
    }

    const skip = (Number(page) - 1) * Number(perPage);
    const take = Number(perPage);

    const order: Record<string, "asc" | "desc"> = {
      [sortBy]: sortDir.toLowerCase() === "asc" ? "asc" : "desc",
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
      }
    }

    const totalItems = await productRepository.count({ where });
    const products = await productRepository.find({ skip, take, where, order });

    const result = {
      data: products,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages: Math.ceil(totalItems / Number(perPage)),
      hasNextPage: Number(page) < Math.ceil(totalItems / Number(perPage)),
      hasPreviousPage: Number(page) > 1,
      nextPage: Number(page) < Math.ceil(totalItems / Number(perPage)) ? Number(page) + 1 : null,
      prevPage: Number(page) > 1 ? Number(page) - 1 : null,
      lastPage: Math.ceil(totalItems / Number(perPage)),
    };

    cache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================
// GET SINGLE PRODUCT (with cache)
// =============================
export const getProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid product ID" });

    const cacheKey = `${CACHE_KEYS.PRODUCT}_${id}`;

    // ✅ To musi być w kodzie!
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`✅ [CACHE HIT] product ${id} from Redis`);
        return res.json(JSON.parse(cached));
      }
      console.log(`❌ [CACHE MISS] product ${id} - fetching from DB`);
    }

    const product = await productRepository.findOneBy({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ To też musi być!
    if (redisClient) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));
      console.log(`💾 [CACHE SET] product ${id} saved to Redis`);
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================
// CREATE PRODUCT
// =============================
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, price, description } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Missing product information" });
    }

    const newProduct = productRepository.create({ name, price, description });
    await productRepository.save(newProduct);

    cache.flushAll();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// =============================
// UPDATE PRODUCT
// =============================
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid product ID" });

    const { name, price, description } = req.body;

    const product = await productRepository.findOneBy({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.price = price != null ? price : product.price;
    product.description = description || product.description;

    const updatedProduct = await productRepository.save(product);

    cache.del(`${CACHE_KEYS.PRODUCT}_${id}`);
    cache.flushAll();
    return res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =============================
// DELETE PRODUCT
// =============================
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid product ID" });

    const result = await productRepository.softDelete(id);
    if (!result.affected) return res.status(404).json({ message: "Product not found" });

    cache.del(`${CACHE_KEYS.PRODUCT}_${id}`);
    cache.flushAll();
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
