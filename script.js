const numeroWhatsApp = "542664747024";
const contenedorProductos = document.querySelector(".productos-container");
const buscador = document.querySelector("#buscador");

let productos = [];

const iconosNotificacion = {
    error: "✕",
    success: "✓",
    info: "ℹ",
    warning: "⚠"
};

function filtrarProductos(texto) {
    const productosFiltrados = productos.filter(function(producto) {
        return producto.nombre.toLowerCase().includes(texto.toLowerCase());
    });
     
      contenedorProductos.innerHTML = "";

    if(productosFiltrados.length === 0){
      mostrarNotificacion("No se encontraron productos.","info");
      return;
    }

    productosFiltrados.forEach(function(producto) {
        const tarjeta = crearProducto(producto);
        contenedorProductos.appendChild(tarjeta);
    });
}

function mostrarNotificacion(mensaje, tipo) {
  const notificacion = document.createElement("div");
  const icono = iconosNotificacion[tipo];

  const elementoIcono = document.createElement("span");
  elementoIcono.textContent = icono;
  elementoIcono.classList.add("notificacion-icono");

  const elementoMensaje = document.createElement("span");
  elementoMensaje.textContent = mensaje;

  notificacion.classList.add("notificacion");
  notificacion.classList.add(tipo);

  notificacion.appendChild(elementoIcono);
  notificacion.appendChild(elementoMensaje);

  document.body.appendChild(notificacion);

  setTimeout(function () {
    notificacion.style.animation = "desaparecer 0.3s ease";
  }, 3000);

  notificacion.addEventListener("animationend", function (evento) {
    if (evento.animationName === "desaparecer") {
      notificacion.remove();
    }
  });
}

function formatearPrecio(precio) {
    return precio.toLocaleString("es-AR");
}

function buscarProducto(id){
    return productos.find(function(producto){
        return producto.id === Number(id);
    });
}

function crearMensajeWhatsApp(producto){
     return `Hola, quisiera consultar por la ${producto.nombre}. Vi que su precio es $${formatearPrecio(producto.precio)}`;
}

function crearUrlWhatsApp(mensaje){
    const mensajeCodificado = encodeURIComponent(mensaje);
    return  "https://wa.me/" + numeroWhatsApp + "?text=" + mensajeCodificado;
}

function consultarProducto(id){
    const productoEncontrado = buscarProducto(id);
    console.log(productoEncontrado);
    if (!productoEncontrado){
        mostrarNotificacion("No se encontro el producto", "error");
        return;
    }

    const mensaje = crearMensajeWhatsApp(productoEncontrado);
    const url = crearUrlWhatsApp(mensaje);

    window.open(url, "_blank");
}



function crearProducto(producto) {
  const articulo = document.createElement("article");
  articulo.dataset.id = producto.id;

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  articulo.appendChild(imagen);

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;
  articulo.appendChild(titulo);

  const descripcion = document.createElement("p");
  descripcion.textContent = producto.descripcion;
  articulo.appendChild(descripcion);

  const precio = document.createElement("p");
  precio.textContent = "$" + formatearPrecio(producto.precio);
  precio.classList.add("precio");

  articulo.appendChild(precio);

  const boton = document.createElement("button");
  boton.textContent = "Consultar";
  boton.classList.add("boton-consultar");
  boton.setAttribute("aria-label", `Consultar por ${producto.nombre}`);

  boton.addEventListener("click", function () {
    consultarProducto(articulo.dataset.id);
   });

  articulo.appendChild(boton);

  return articulo;
}

function cargarProductos(){
  return fetch("productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos.");
      }

      return respuesta.json();
    })
    .then(function (datos) {
      
      if (!Array.isArray(datos)) {
        mostrarNotificacion(
          "Los datos de los productos no son válidos",
          "error",
        );
        return;
      }

      if (datos.length === 0) {
        mostrarNotificacion("No hay productos disponibles", "info");
        return;
      }

      productos = datos;

      datos.forEach(function (producto) {
        const tarjeta = crearProducto(producto);
        contenedorProductos.appendChild(tarjeta);
      });
    })
    .catch(function (error) {
      console.error("Error al cargar los productos", error);
      mostrarNotificacion("No se pudieron cargar los productos.", "error");
    });
}

cargarProductos();
buscador.addEventListener("input", function() {
    filtrarProductos(buscador.value);
});