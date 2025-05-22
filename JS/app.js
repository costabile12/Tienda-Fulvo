//Funcion para cargar cards
cargarTarjetas = (product) => {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("productoCard");
    cardDiv.innerHTML = `
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                        <div class="card-body cuerpo-tarjeta">
                        <h5 class="card-title titulo-card">${product.title}</h5>
                        <p class="card-text card-descripcion">${product.description}</p>
                        <p class="price">$${product.price}</p>
                        <button class="btn btn-secondary btn-descripcion" onclick="abrirDescripcion(${product.id}, '${product.title}', ${product.price}, '${product.description}', '${product.thumbnail}')">Abrir Descripción</button>
                        <br>
                        <a href="#" class="btn btn-primary btn-comprar" onclick="agregarAlCarrito('${product.title}',${product.price}, ${product.id}, '${product.thumbnail}')">Comprar</a>
                        </div>`;
    return cardDiv
}


//Cargar cards de forma dinamica 
document.addEventListener("DOMContentLoaded", () => {
    const productosPopulares = document.querySelector("#productosPopulares");
    const camisetasEuropeas = document.querySelector("#camisetasEuropeas");
    const camisetasArgentinas = document.querySelector("#camisetasArgentinas");
    const camisetasRetro = document.querySelector("#camisetasRetro");
    const camisetasMundo = document.querySelector("#camisetasMundo");

    fetch("https://dummyjson.com/products")
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de productos'); // verifica si la respuesta de la red fue exitosa
                //La propiedad response.ok es un booleano que es true si el estado de la respuesta HTTP está en el rango 200-299 (indicando éxito). Si response.ok es false (lo que significa que hubo un error HTTP, como un 404 o 500), se lanza un nuevo objeto Error con el mensaje especificado. Esto detiene la ejecución de los siguientes .then() y pasa el control al bloque .catch()
            }
            return response.json();
        })
        .then(data => {
            if(productosPopulares) productosPopulares.innerHTML = "";
            if(camisetasEuropeas) camisetasEuropeas.innerHTML = "";
            if(camisetasArgentinas) camisetasArgentinas.innerHTML = "";
            if(camisetasRetro) camisetasRetro.innerHTML = "";
            if(camisetasMundo) camisetasMundo.innerHTML = "";

            data.products.forEach(product => {
                let tarjeta = cargarTarjetas(product);

                //cargar los productos populares
                if(productosPopulares && product.stock > 0 && product.rating > 4.5) {
                    productosPopulares.appendChild(tarjeta);
                //cargar los productos de categoria beauty
                } else if(camisetasEuropeas && product.stock > 0 && product.category === "beauty") {
                    camisetasEuropeas.appendChild(tarjeta);
                //cargar los productos de categoria fragances
                } else if(camisetasArgentinas && product.stock > 0 && product.category === "fragrances") {
                    camisetasArgentinas.appendChild(tarjeta);
                //cargar los productos de categoria groceries
                } else if(camisetasRetro && product.stock > 0 && product.category === "groceries") {
                    camisetasRetro.appendChild(tarjeta);
                //cargar los productos de categoria furnuture
                } else if(camisetasMundo && product.stock > 0 && product.category === "furniture") {
                    camisetasMundo.appendChild(tarjeta);
                }
            });
        })
        .catch(error => console.log('Error en la conexion...', error));
});

//Funcionalidad carrito de compras

let carrito = [];
let total = 0;


//Funcion para mostrar mensaje cuando el carrito esta vacio
mensajeVacioCarrito = () => {
    const mensajeVacio = document.querySelector("#mensajeVacio");
    mensajeVacio.style.display = (carrito.length === 0) ? "block":"none"
}

//Funcion para guardar en localStorage el carrito y el precio total
guardarCarritoEnLocalStorage = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("total", total.toString());
}


//Funcion para agregar productos al carrito
agregarAlCarrito = (nombre, precio, id, imagen) => {
    let listaCarrito = document.querySelector("#listCarrito");
    let productoExistente = carrito.find(p => p.id === id);

    if (productoExistente){
        productoExistente.cantidad+=1;
        let productoLi = document.querySelector(`li[data-id='${id}']`);
        if (productoLi){
            let contadorCantidad = productoLi.querySelector(".cantidad");
            contadorCantidad.innerText = productoExistente.cantidad;
        }
        total += precio;
        document.querySelector("#precioTotal").innerText = total.toFixed(2);

        actualizarContadorGlobal();
        guardarCarritoEnLocalStorage();
    }
    else {

        let producto = {
            id:id,
            nombre:nombre,
            precio:precio,
            imagen:imagen,
            cantidad:1
         }


        let productoItem = document.createElement("li");
        productoItem.setAttribute("data-id", id);
        productoItem.innerHTML =`<img src="${imagen}" alt="${nombre}">
                <h3>${nombre}</h3>
                <h4>$${precio}</h4>
                <div class="controlador-cantidad">
                    <button class="btn-reducir" onclick="reducirCantidad(${id})">-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button class="btn-aumentar" onclick="aumentarCantidad(${id})">+</button>
                </div> `;
        listaCarrito.appendChild(productoItem);
        carrito.push(producto);

        total+=precio;
        let precioTotal = document.querySelector("#precioTotal");
        precioTotal.innerText = total.toFixed(2);



        actualizarContadorGlobal();
        guardarCarritoEnLocalStorage();
        mensajeVacioCarrito();
    }


    
}

//Funcion para aumnetar cantidad de un producto item dentro del carrito
aumentarCantidad = (id) => {
    let producto = carrito.find(p => p.id === id);
    if(producto){
        producto.cantidad+=1;
        
        let li = document.querySelector(`li[data-id='${id}']`);
        li.querySelector(".cantidad").innerText = producto.cantidad;
        total+=producto.precio;
        document.querySelector("#precioTotal").innerText = total.toFixed(2);
        
       
        actualizarContadorGlobal();
        guardarCarritoEnLocalStorage();
        mensajeVacioCarrito();

    }

    
}

//Funcion para reducir la cantidad de un producto en el carrito
reducirCantidad = (id) => {
    let producto = carrito.find(p => p.id === id);
    if(producto && producto.cantidad > 1){
        producto.cantidad-=1;
        let li = document.querySelector(`li[data-id='${id}']`);
        li.querySelector(".cantidad").innerText = producto.cantidad;
        total-=producto.precio;
    }
    else if (producto && producto.cantidad === 1) {
        total -= producto.precio;
        carrito = carrito.filter(p => p.id !== id);
        let li = document.querySelector(`li[data-id='${id}']`);
        if (li) li.remove()
    }
        document.querySelector("#precioTotal").innerText = total.toFixed(2);
        
        
        actualizarContadorGlobal();
        guardarCarritoEnLocalStorage();
        mensajeVacioCarrito();
}

actualizarContadorGlobal = () => {
    let cantidadTotal = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let contadorProductos = document.querySelector("#cantidad");

    if (cantidadTotal === 0) {
        contadorProductos.style.display = "none";
    } else {
        contadorProductos.style.display = "inline-block";
        contadorProductos.innerText = cantidadTotal;
        
    }
}








//Funcion para abrir y cerrar carrito
const btnCarrito = document.getElementById("btnCarrito");
const btnCarritoClose = document.getElementById("btnCerrarCarrito")
const containerCarrito = document.querySelector(".carrito");
const overlay = document.getElementById("overlay");

// Abrir panel de carrito
btnCarrito.addEventListener("click", () => {
    containerCarrito.classList.add("open");
    overlay.classList.add("active");
    mensajeVacioCarrito(carrito)
    
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
