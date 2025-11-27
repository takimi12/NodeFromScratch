import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("add-product",
   { activePage: "add" });
});

router.get("/products", (req, res) => {
  const productsData = [
    { name: "Test", price: 21, desc: "Lorem ipsum" },
  ];
  res.render("products", {
    productsData,
    activePage: "products"
  });
});


export default router;
