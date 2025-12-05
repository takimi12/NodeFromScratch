import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/isAuth";
import { AppDataSource } from "../data-source";
import { Cart } from "../models/cart";

const cartRepository = AppDataSource.getRepository(Cart);

export const getUserCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.uid;
    if (!id) return res.status(400).json({ message: "Invalid request" });

    const cart = await cartRepository.findOne({
      where: { user: { externalId: id } },
      relations: ["user", "products"], // jeśli chcesz załadować produkty powiązane
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
