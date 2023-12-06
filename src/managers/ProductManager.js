import { promises as fs } from "fs";
import path from "path";
import __dirname from "../utils.js";


class ProductManager {
    constructor(pathfile) {
        this.path = path.join(__dirname, `/files/${pathfile}`);
    }

    initializeId = async() => {
        try {
            let products = await this.readProducts();
            this.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        } catch (error) {
            console.error("Error initializing ID:", error.message);
            this.id = 1; 
        }
    }

   addProduct = async(title, description, price, thumbnails, code, stock) =>{
        try {
            if (typeof this.id === 'undefined') {
                await this.initializeId();
            }

            let products = await this.readProducts();

            let newProduct = {
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                id: this.id
            };

            products.push(newProduct);

            await fs.writeFile(this.path, JSON.stringify(products));

            return "Producto Agregado ";
        } catch (error) {
            console.error("Error adding product:", error.message);
            return "Error al agregar producto";
        }
    }



    readProducts = async () => {
        try {
            const productsContent = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(productsContent);

            return Array.isArray(products) ? products : [];
            
        } catch (error) {
            console.error("Error reading file:", error.message);
            return [];
        }
    }

    getProducts = async () => {
       return await this.readProducts();
    }

    exist(id, productList) {
        return productList.find((producto) => producto.id === id)
    }

    getProductsByID = async (id) => {
        try {
            let products = await this.readProducts();
            let product = this.exist(id, products);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            throw new Error("Error al obtener producto por ID");
        }
    
    }

    deleteProductByID = async (id) => {
        try {
            let products = await this.readProducts();
            
            // Verificar si el producto existe
            const existingProduct = this.exist(id, products);
            if (!existingProduct) {
                throw new Error("Producto no encontrado");
            }

            // Filtrar los productos y escribir en el archivo
            const productFilter = products.filter((p) => p.id !== id);
            await fs.writeFile(this.path, JSON.stringify(productFilter));

            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw new Error("Error al eliminar producto");
        }
    }

    upgradeProduct = async ({ id, ...product }) => {
        try {
            let products = await this.readProducts();
            
            // Verificar si el producto existe
            const existingProduct = this.exist(id, products);
            if (!existingProduct) {
                throw new Error("Producto no encontrado");
            }

            // Eliminar el producto existente
            const productFilter = products.filter((p) => p.id !== id);
            await fs.writeFile(this.path, JSON.stringify(productFilter));

            // Agregar el producto actualizado
            const productMod = [{ ...product, id }, ...productFilter];
            await fs.writeFile(this.path, JSON.stringify(productMod));

            return productMod;
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw new Error("Error al actualizar producto");
        }
    }
}






export default ProductManager;