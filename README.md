# Proyecto Final - CoderHouse - Backend

Alumno: Daniel Diaz

Comisión: 70020

Docente: Luis Alejandro Mera

Tutores: Abigail Salas, Alexis Coronel

## Descripción del Proyecto

Este proyecto es un servidor básico de e-commerce desarrollado con Node.js y Express. Permite gestionar productos y carritos de compra, ofreciendo funcionalidades como la adición, eliminación y actualización de productos en tiempo real mediante WebSockets.

## Instalación

### Requisitos Previos

- Node.js v14 o superior
- MongoDB

### Pasos de Instalación

1. Clonar el repositorio:

git clone https://github.com/Dragunovich1/proyecto-final-backend-daniel-diaz
cd proyecto-final-backend-daniel-diaz

2. Instalar las dependencias:

npm install

3. Configurar la base de datos:

Asegúrate de tener una instancia de MongoDB corriendo. Puedes usar la configuración por defecto en \`mongodb://localhost:27017/base_de_datos\` o modificar la configuración en \`app.js\`.

## Ejecución del Servidor

### Modo Desarrollo

Para ejecutar el servidor en modo desarrollo (con reinicio automático):

npm run dev

### Modo Producción

Para ejecutar el servidor en modo producción:

npm start

El servidor estará corriendo en \`http://localhost:8080\`.

## Vistas

### Dashboard

- **URL**: \`http://localhost:8080\`
- **Descripción**: Muestra la lista de productos disponibles, permite acceder al resto de las vistas, se pueden realizar todas las pruebas desde aqui.

### Agregar/modificar/eliminar productos

- **URL**: \`http://localhost:8080/realtimeproducts\`
- **Descripción**: Muestra una lista de productos que se actualiza en tiempo real. Permite agregar, modificar y eliminar productos.

### Carrito de Compras

- **URL**: \`http://localhost:8080/carts/:cid\`
- **Descripción**: Muestra los productos en el carrito específico. Permite incrementar, decrementar y eliminar productos del carrito.

### Detalle de Producto

- **URL**: \`http://localhost:8080/products/:pid\`
- **Descripción**: Muestra los detalles de un producto específico y permite agregarlo al carrito.


## Instrucciones de Uso

3. Acceder a las siguientes rutas desde el navegador:

- \`http://localhost:8080\` para ver el dashboard con la lista de productos.
- \`http://localhost:8080/realtimeproducts\` para gestionar productos en tiempo real.
- \`http://localhost:8080/carts/:cid\` para ver y gestionar el carrito de compras.
- \`http://localhost:8080/products/:pid\` para ver los detalles de un producto específico.

4. Se agregó una interfaz grafica a modo de dashboard para realizar las pruebas necesarias.

## Testing

Para realizar pruebas, puedes utilizar herramientas como Postman o Insomnia para enviar solicitudes HTTP a las rutas de la API. Asegúrate de tener la base de datos MongoDB corriendo y correctamente configurada.

## Pruebas Manuales con Postman

### Productos

1. **Obtener productos con filtros, paginación y ordenamientos**
   - **URL**: `GET /api/products`
   - **Params**:
     - `limit`: 10
     - `page`: 1
     - `sort`: `asc` o `desc`
     - `query`: (categoría deseada)
   - **Response**: Debe devolver la estructura con paginación y productos.

2. **Agregar un nuevo producto**
   - **URL**: `POST /api/products`
   - **Body (JSON)**:
     ```json
     {
       "title": "Nuevo Producto",
       "description": "Descripción del producto",
       "code": "NP001",
       "price": 100,
       "stock": 50,
       "category": "Categoría",
       "status": true
     }
     ```
   - **Response**: Debe devolver el producto creado.

3. **Obtener producto por ID**
   - **URL**: `GET /api/products/:pid`
   - **Response**: Debe devolver el producto con el ID especificado.

4. **Actualizar un producto**
   - **URL**: `PUT /api/products/:pid`
   - **Body (JSON)**:
     ```json
     {
       "title": "Producto Actualizado",
       "description": "Descripción actualizada",
       "price": 120
     }
     ```
   - **Response**: Debe devolver el producto actualizado.

5. **Eliminar un producto**
   - **URL**: `DELETE /api/products/:pid`
   - **Response**: Debe devolver un mensaje de confirmación de eliminación.

### Carritos

1. **Crear un nuevo carrito**
   - **URL**: `POST /api/carts`
   - **Response**: Debe devolver el carrito creado.

2. **Obtener carrito por ID**
   - **URL**: `GET /api/carts/:cid`
   - **Response**: Debe devolver el carrito con el ID especificado.

3. **Agregar producto al carrito**
   - **URL**: `POST /api/carts/:cid/product/:pid`
   - **Response**: Debe devolver el carrito con el producto añadido.

4. **Eliminar un producto del carrito**
   - **URL**: `DELETE /api/carts/:cid/products/:pid`
   - **Response**: Debe devolver el carrito con el producto eliminado.

5. **Actualizar productos en el carrito**
   - **URL**: `PUT /api/carts/:cid`
   - **Body (JSON)**:
     ```json
     {
       "products": [
         { "product": "product_id_1", "quantity": 2 },
         { "product": "product_id_2", "quantity": 5 }
       ]
     }
     ```
   - **Response**: Debe devolver el carrito actualizado.

6. **Actualizar cantidad de un producto en el carrito**
   - **URL**: `PUT /api/carts/:cid/products/:pid`
   - **Body (JSON)**:
     ```json
     {
       "quantity": 3
     }
     ```
   - **Response**: Debe devolver el carrito con la cantidad actualizada del producto.

7. **Eliminar todos los productos del carrito**
   - **URL**: `DELETE /api/carts/:cid`
   - **Response**: Debe devolver el carrito vacío.
