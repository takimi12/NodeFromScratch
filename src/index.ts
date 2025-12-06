import "reflect-metadata";
import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import apiV1 from "../routes/v1";
import pages from "../routes/pages/index";
import { AppDataSource } from "./data-source";
import { rollbar } from "./config/rollbar-config";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// ===== View engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== Middleware =====
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ===== Routes =====
app.use("/pages", pages);
app.use("/api/v1", apiV1);

swaggerDocs(app)

// ===== 404 =====
app.use((req, res, next) => {
  res.status(404).send("<h1>Not found</h1>");
});

// ===== Rollbar – jako ostatni middleware! =====
app.use(rollbar.errorHandler());

// ===== Start servera =====
AppDataSource.initialize().then(() => {

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    rollbar.log("Server started successfully");
  });
});


