//Cargar cards de forma dinamica 
document.addEventListener("DOMContentLoaded", () => {

    const contenerdorProductos = document.querySelector(".container_productos");
    
    contenerdorProductos.innerHTML = "",

    fetch("https://dummyjson.com/products")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            containerCarrito.innerHTML =""
            data.products.forEach(product => {
                let cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                cardDiv.classList.add("productoCard");
                cardDiv.innerHTML = `
                        <img src="${product.images[0]}" card-img-top" alt="${product.title}">
                        <div class="card-body cuerpo-tarjeta">
                        <h5 class="card-title titulo-card">${product.title}</h5>
                        <p class="card-text card-descripcion">${product.description}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-secondary btn-descripcion" onclick="abrirDescripcion(${product.id}, '${product.title}', ${product.price}, '${product.description}', '${JSON.stringify(product.images)}')">Abrir Descripción</button>
                        <br>
                        <a href="#" class="btn btn-primary btn-comprar" onclick="agregarAlCarrito('${product.title}',${product.price}, ${product.id})">Comprar</a>
                        </div>`;

                contenerdorProductos.appendChild(cardDiv);
            });

        
    })
});

//Funcion para abrir y cerrar carrito
const btnCarrito = document.getElementById("btnCarrito");
const btnCarritoClose = document.getElementById("btnCerrarCarrito")
const containerCarrito = document.querySelector(".carrito");
const overlay = document.getElementById("overlay");

// Abrir panel de carrito
btnCarrito.addEventListener("click", () => {
    containerCarrito.classList.add("open");
    overlay.classList.add("active");
    
});
//Cerrar carrito desde el boton del panel
btnCarritoClose.addEventListener("click" ,() =>{
    containerCarrito.classList.remove("open");
    overlay.classList.remove("active");
});
//Cerrar carrito desde el overlay
overlay.addEventListener("click",() =>{
    containerCarrito.classList.remove("open");
    overlay.classList.remove("active")
    
});

