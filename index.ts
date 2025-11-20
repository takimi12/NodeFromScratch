import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import apiV1 from "./routes/v1"; 

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/v1", apiV1);

app.use((req,res,next)=>{
    res.status(404).send('<h1>Not found</h1>')
})

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});