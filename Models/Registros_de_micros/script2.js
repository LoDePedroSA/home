// ====== FUNCIONES SIN LOCALSTORAGE ======

// Cambiar entre pestañas
function cambiarPestana(nombrePestana) {
    // Ocultar todas las pestañas
    const pestanas = document.querySelectorAll(".pestana");
    pestanas.forEach(pestana => {
        pestana.style.display = "none";
    });

    // Mostrar la pestaña seleccionada
    const pestanaActiva = document.getElementById(`pestana-${nombrePestana}`);
    if (pestanaActiva) {
        pestanaActiva.style.display = "block";

        // Si es la pestaña "nuevo", cargar las líneas
        if (nombrePestana === "nuevo") {
            recargarLineas();
        }
    }
}

// Ir a inicio
function irAInicio() {
    cambiarPestana("inicio");
}

// Ir a nuevo viaje
function irANuevo() {
    cambiarPestana("nuevo");
}

// Ir a historial
function irAHistorial() {
    cambiarPestana("historial");
}

// Cargar líneas en el select de líneas
function recargarLineas() {
    const selectLinea = document.getElementById("selectLinea");
    const lineas = obtenerLineas();

    // Limpiar el select
    selectLinea.innerHTML = "<option value=''>-- Seleccione una línea --</option>";

    // Agregar las líneas disponibles
    lineas.forEach(linea => {
        const option = document.createElement("option");
        option.value = linea.id;
        option.textContent = `Línea ${linea.nombre}`;
        selectLinea.appendChild(option);
    });

    // Limpiar el select de ramales
    const selectRamal = document.getElementById("selectRamal");
    selectRamal.innerHTML = "<option value=''>-- Seleccione un ramal --</option>";
}

// Cargar ramales según la línea seleccionada
function recargarRamales() {
    const selectLinea = document.getElementById("selectLinea");
    const selectRamal = document.getElementById("selectRamal");

    const lineaSeleccionada = selectLinea.value;

    if (!lineaSeleccionada) {
        alert("Por favor, selecciona una línea primero.");
        return;
    }

    // Obtener los ramales de la línea seleccionada
    const ramales = obtenerRamales(lineaSeleccionada);

    // Limpiar el select de ramales
    selectRamal.innerHTML = "<option value=''>-- Seleccione un ramal --</option>";

    // Agregar los ramales disponibles
    ramales.forEach(ramal => {
        const option = document.createElement("option");
        option.value = ramal;
        option.textContent = ramal;
        selectRamal.appendChild(option);
    });
}
