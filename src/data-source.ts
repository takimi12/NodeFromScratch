// import { DataSource } from "typeorm";
// import dotenv from "dotenv";

// import { Product } from "./models/product";
// import { User } from "./models/user";
// import { Cart } from "./models/cart";

// dotenv.config();

// if (
//   !process.env.DB_HOST ||
//   !process.env.DB_PORT ||
//   !process.env.DB_USER ||
//   !process.env.DB_USER_PASSWORD ||
//   !process.env.DB_NAME
// ) {
//   throw new Error("Please provide the database connection details");
// }

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_USER_PASSWORD,
//   database: process.env.DB_NAME,

//   synchronize: true,         
//   logging: true,

//   entities: [Product, User, Cart],   
//   subscribers: [],
//   migrations: [],
// });
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

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

  synchronize: false,      // ❗ WYŁĄCZ synchronizację
  logging: true,

  entities: [path.join(__dirname, "./models/*{.ts,.js}")],
  subscribers: [],
  migrations: [path.join(__dirname, "./migrations/*{.ts,.js}")],

  migrationsRun: true,      // ❗ Automatyczne uruchamianie migracji
});
