import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Product } from "./models/product";
import { User, UserRole } from "./models/user";
import { DeepPartial } from "typeorm";

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    // ===== Produkty =====
    const productRepo = AppDataSource.getRepository(Product);
    const existingProducts = await productRepo.find();

    if (existingProducts.length === 0) {
      await productRepo.save([
        { name: "Product 1", description: "Opis produktu 1", price: 100.15, stock: 10 },
        { name: "Product 2", description: "Opis produktu 2", price: 200.22, stock: 20 },
        { name: "Product 3", description: "Opis produktu 3", price: 300.22, stock: 30 },
      ] as DeepPartial<Product>[]);
      console.log("Products seeded");
    }

    // ===== Użytkownicy =====
    const userRepo = AppDataSource.getRepository(User);
    const existingUsers = await userRepo.find();

    if (existingUsers.length === 0) {
      const users: DeepPartial<User>[] = [
        { externalId: "admin-uuid-1", role: UserRole.ADMIN },
        { externalId: "user-uuid-1", role: UserRole.GHOST },
      ];

      await userRepo.save(users);
      console.log("Users seeded");
    }

    await AppDataSource.destroy();
    console.log("Seeding finished");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

seed();
