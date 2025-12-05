// import "reflect-metadata";
// import express, { Express } from "express";
// import dotenv from "dotenv";
// import path from "path";


// import apiV1 from "./routes/v1";
// import pages from "./routes/pages";
// import bodyParser from "body-parser";
// import { AppDataSource } from "./data-source";

// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT || 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views")); 

// app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app.use("/pages", pages);
// app.use("/api/v1", apiV1);




// app.use((req, res, next) => {
//   res.status(404).send("<h1>Not found</h1>");
// });


// AppDataSource.initialize().then(()=>{
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
//   });
// })

import "reflect-metadata";
import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import apiV1 from "./routes/v1";
import pages from "./routes/pages";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 

// Middleware do parsowania JSON i formularzy
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ===== Dodajemy middleware do ciasteczek i CORS =====
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // frontendowy adres (można w .env)
    credentials: true, // pozwala przesyłać ciasteczka
  })
);

// ======================
// Routy
app.use("/pages", pages);
app.use("/api/v1", apiV1);

// Obsługa 404
app.use((req, res, next) => {
  res.status(404).send("<h1>Not found</h1>");
});

// Inicjalizacja bazy danych i start serwera
AppDataSource.initialize().then(()=>{
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
