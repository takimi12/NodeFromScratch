import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "./models/product";
import { Cart } from "./models/cart";
import { User } from "./models/user";

dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_USER_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error("Please provide the database connection details");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Product, Cart, User],
});
