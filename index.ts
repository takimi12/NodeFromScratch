import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";

import apiV1 from "./routes/v1";
import pages from "./routes/pages";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Konfiguracja Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/pages", pages);
app.use("/api/v1", apiV1);

app.use((req, res, next) => {
  res.status(404).send("<h1>Not found</h1>");
});

app.listen(port, () => {
  console.log(`[server]: Server running on http://localhost:${port}`);
});