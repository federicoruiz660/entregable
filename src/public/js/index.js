const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const descriptionInput = document.getElementById('description');
    const productList = document.getElementById('products-list');
  
    const submitProductForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const price = priceInput.value;
        const stock = stockInput.value;
        const description = descriptionInput.value;
  
        socketClient.emit('addProduct', { title, price, stock, description }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (productData) => {
        console.log('Nuevo producto agregado en tiempo real:', productData);
        const listItem = document.createElement('li');
        listItem.textContent += `Nombre: ${productData.title}, Precio: ${productData.price}, Descripción: ${productData.description}`;
        productList.appendChild(listItem);
    });
});