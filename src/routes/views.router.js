import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router()
const path = "products.json"
const manager = new ProductManager(path);

router.get("/", async (req,res)=>{
    const allProducts = await manager.getProducts();
    res.render('home', {products: allProducts })
})

router.get("/realtimeproducts", async (req,res)=>{
    const allProducts = await manager.getProducts();
    res.render("realtimeproducts",{products: allProducts})
})


export default router;