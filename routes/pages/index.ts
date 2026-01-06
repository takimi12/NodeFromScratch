import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("add-product", { activePage: 'add' });
});

interface Product {
  name: string;
  price: number;
  desc: string;
}

router.get("/products", (req: Request, res: Response) => {
  const productsData: Product[] = [
    {
      name: "Test Product",
      price: 21,
      desc: "lorem ipsum",
    },
  ];
  
  res.render("products", { productsData, activePage: 'products' });
});

export default router;
