cargarTarjetas = (product) => {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "productoCard");

    cardDiv.innerHTML = `
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body cuerpo-tarjeta">
            <h5 class="card-title titulo-card">${product.title}</h5>
            <p class="card-text card-descripcion">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button class="btn btn-primary btn-comprar">Comprar</button>
        </div>`;

    // ➕ Agregamos el event listener al botón después de insertarlo
    const btnComprar = cardDiv.querySelector(".btn-comprar");
    btnComprar.addEventListener("click", () => {
        abrirDescripcion(
            product.id,
            product.title,
            product.price,
            product.description,
            product.thumbnail
        );
    });

    return cardDiv;
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
    const total = document.querySelector(".total");
    mensajeVacio.style.display = (carrito.length === 0) ? "block":"none";
    total.style.display = (carrito.length === 0) ? "none":"block";
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

        alert(`${nombre} se agrego al carrito`)


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

//Funcion para actualizar el contador del carrito 
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

//Funcion para el boton de agregar al carrito
vaciarCarrito = () => {
    carrito = [];
    total = 0;
    document.querySelector("#listCarrito").innerHTML ="";
    document.querySelector("#precioTotal").innerText = "0.00";
    actualizarContadorGlobal();
    guardarCarritoEnLocalStorage();
    mensajeVacioCarrito();
    alert("El carrito de compras se ha vaciado")
    
}

//Cargar el carrito desde el local storage
restaurarCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    const totalGuardado = parseFloat(localStorage.getItem("total"));

    if (carritoGuardado && Array.isArray(carritoGuardado)) {
        carrito = carritoGuardado;
        total = isNaN(totalGuardado) ? 0 : totalGuardado;

        const listaCarrito = document.querySelector("#listCarrito");
        listaCarrito.innerHTML = "";

        carrito.forEach(p => {
            let productItem = document.createElement("li");
            productItem.setAttribute("data-id", p.id);
            productItem.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <h4>$${p.precio}</h4>
                <div class="controlador-cantidad">
                    <button class="btn-reducir">-</button>
                    <span class="cantidad">${p.cantidad}</span>
                    <button class="btn-aumentar">+</button>
                </div>
            `;

            // ✅ Agregamos los event listeners después de agregar el HTML
            const btnReducir = productItem.querySelector(".btn-reducir");
            const btnAumentar = productItem.querySelector(".btn-aumentar");

            btnReducir.addEventListener("click", () => reducirCantidad(p.id));
            btnAumentar.addEventListener("click", () => aumentarCantidad(p.id));

            listaCarrito.appendChild(productItem);
        });

        document.querySelector("#precioTotal").innerText = total.toFixed(2);
        actualizarContadorGlobal();
        mensajeVacioCarrito();
    }
}


let productoSeleccionado = null; //Variable global donde se guarda temporalmente el producto actual al hacer clic en "Abrir descripción"

//Funcion para abrir un modal con la descripcion del producto
abrirDescripcion = (id, titulo, precio, descripcion, imagen) => {
    
    //Guarda los datos del producto actual para usarlos más tarde (cuando se agregue al carrito).
    productoSeleccionado = { id, titulo, precio, descripcion, imagen };


    //Inserta la información del producto en el modal.
    document.getElementById("modalImagen").src = imagen;
    document.getElementById("modalTitulo").innerText = titulo;
    document.getElementById("modalDescripcionTexto").innerText = descripcion;
    document.getElementById("modalPrecio").innerText = precio;

    //Restablece los valores de cantidad y talle a sus valores por defecto cada vez que abrís el modal.
    document.getElementById("cantidadProducto").value = 1;
    // document.getElementById("talleProducto").value = "M";

    document.getElementById("modalDescripcion").style.display = "block";
}

cerrarModal = () => {
    document.getElementById("modalDescripcion").style.display = "none";
}

confirmarAgregarAlCarrito = () => {
    const cantidad = parseInt(document.getElementById("cantidadProducto").value);
    const idProducto = productoSeleccionado.id;
    const nombreProducto = productoSeleccionado.titulo;

    for (let i = 0; i < cantidad; i++) {
        agregarAlCarrito(nombreProducto, productoSeleccionado.precio, idProducto, productoSeleccionado.imagen);
    }

    cerrarModal();
}


const btnComprar = document.querySelector("#btnComprar");
const formularioDeCompras = document.querySelector("#formulario-compra");


btnComprar.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0){
        alert("El carrito esta vacio");
        return;
    }

    //Mostrar formularo de compra
    formularioDeCompras.classList.remove("oculto");

    
});

document.getElementById("confirmar-compra").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !email || !direccion) {
        alert("Por favor completá todos los campos.");
        return;
    }

    alert("¡Gracias por tu compra, " + nombre + "!");

    vaciarCarrito(); // Vaciamos todo y actualizamos

    formularioDeCompras.classList.add("oculto"); // Ocultamos el formulario
});

document.getElementById("btnCerrarFormulario").addEventListener("click", () => {
    formularioDeCompras.classList.add("oculto");
});



window.addEventListener("DOMContentLoaded", restaurarCarrito);




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

