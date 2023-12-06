import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const path = "carts.json";
const managerCart = new CartManager(path);

router.post('/',async (req,res)=>{
    try {
        const response = await managerCart.newCart();
        res.json(response)
    } catch (error) {
        res.send('Error al crear carrito')
    }
} )


router.get('/:cid',async (req,res)=>{
    const cid = parseInt(req.params.cid);
    try {
        const response = await managerCart.getCartProducts(cid);
        res.send(response)
    } catch (error) {
        res.send('Error al intentar enviar los productos del carrito')
    }
} )


router.post('/:cid/products/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid;
    
    try {
        await managerCart.addProductToCart(cid, pid);
        res.json({
            status: "Success",
            message: 'Producto agregado a la lista de compras'
        });
    } catch (error) {
        console.error('Error al intentar guardar producto:', error.message);
        res.status(500).json({
            status: "Error",
            message: 'Error al intentar guardar producto'
        });
    }
});


export { router as CartRouter };