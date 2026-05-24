// ====== FUNCIONES CON LOCALSTORAGE ======

// Obtener fecha y hora actual de Argentina (UTC-3)
function obtenerFechaHoraArgentina() {
    const ahora = new Date();
    // Convertir a hora de Argentina (UTC-3)
    const horaArgentina = new Date(ahora.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }));
    
    const fecha = horaArgentina.toLocaleDateString('es-AR');
    const hora = horaArgentina.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    return { fecha, hora, fechaHora: `${fecha} - ${hora}` };
}

// Cargar un nuevo viaje en la base de datos (localStorage)
function cargarNuevoViaje() {
    const lineaSelect = document.getElementById("selectLinea");
    const ramalSelect = document.getElementById("selectRamal");
    const horarioSubida = document.getElementById("horarioSubida");
    const horarioBajada = document.getElementById("horarioBajada");
    const ubicacionSubida = document.getElementById("ubicacionSubida");
    const ubicacionBajada = document.getElementById("ubicacionBajada");
    const interno = document.getElementById("interno");

    // Validar que todos los campos estén completos
    if (!lineaSelect.value || !ramalSelect.value || !horarioSubida.value || !horarioBajada.value || !ubicacionSubida.value || !ubicacionBajada.value || !interno.value) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear objeto del viaje
    const fechaHoraArg = obtenerFechaHoraArgentina();
    const viaje = {
        id: Date.now(),
        linea: lineaSelect.value,
        ramal: ramalSelect.value,
        horarioSubida: horarioSubida.value,
        horarioBajada: horarioBajada.value,
        ubicacionSubida: ubicacionSubida.value,
        ubicacionBajada: ubicacionBajada.value,
        interno: interno.value,
        fecha: fechaHoraArg.fecha,
        hora: fechaHoraArg.hora,
        fechaHoraRegistro: fechaHoraArg.fechaHora
    };

    // Obtener viajes existentes
    let viajes = JSON.parse(localStorage.getItem("viajes")) || [];

    // Agregar el nuevo viaje
    viajes.push(viaje);

    // Guardar en localStorage
    localStorage.setItem("viajes", JSON.stringify(viajes));

    // Limpiar los inputs
    lineaSelect.value = "";
    ramalSelect.value = "";
    ramalSelect.innerHTML = "<option value=''>-- Seleccione un ramal --</option>";
    horarioSubida.value = "00:00";
    horarioBajada.value = "00:00";
    ubicacionSubida.value = "";
    ubicacionBajada.value = "";
    interno.value = "";

    alert("¡Viaje registrado correctamente! 🎉");

    // Llevar al usuario a la pestaña "inicio"
    irAInicio();
}

// Recargar y mostrar los viajes guardados
function recargarViajes() {
    const viajesdDiv = document.getElementById("viajes");
    const viajes = JSON.parse(localStorage.getItem("viajes")) || [];

    // Limpiar el contenido anterior
    viajesdDiv.innerHTML = "";

    if (viajes.length === 0) {
        alert("No has cargado Viajes aun...");
        return;
    }

    // Mostrar todos los viajes
    viajes.forEach((viaje, index) => {
        const viajeFila = document.createElement("div");
        viajeFila.className = "viaje-item";
        viajeFila.innerHTML = `
            <p><strong>Viaje #${index + 1}</strong></p>
            <p>📍 Línea: <strong>${viaje.linea}</strong></p>
            <p>🛣️ Ramal: <strong>${viaje.ramal}</strong></p>
            <p>🚪 Interno: <strong>${viaje.interno}</strong></p>
            <p>� Subida en: <strong>${viaje.ubicacionSubida}</strong></p>
            <p>📍 Bajada en: <strong>${viaje.ubicacionBajada}</strong></p>
            <p>⏰ Subida: <strong>${viaje.horarioSubida}</strong></p>
            <p>⏱️ Bajada: <strong>${viaje.horarioBajada}</strong></p>
            <p>📅 Fecha: <strong>${viaje.fecha}</strong></p>            <p>🕐 Hora: <strong>${viaje.hora}</strong></p>
            <p>🌍 Registrado (ARG): <strong>${viaje.fechaHoraRegistro}</strong></p>        `;
        viajesdDiv.appendChild(viajeFila);

        // Agregar botón de eliminar este viaje
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.textContent = "🗑️ Eliminar este viaje";
        btnEliminar.onclick = function() {
            eliminarViaje(viaje.id);
        };
        viajeFila.appendChild(btnEliminar);

        // Agregar separador si no es el último viaje
        if (index < viajes.length - 1) {
            const separador = document.createElement("hr");
            separador.className = "separador";
            viajesdDiv.appendChild(separador);
        }
    });
}

// Eliminar un viaje específico por su ID
function eliminarViaje(id) {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que deseas eliminar este viaje?")) {
        return;
    }

    // Obtener viajes existentes
    let viajes = JSON.parse(localStorage.getItem("viajes")) || [];

    // Filtrar para eliminar el viaje con ese ID
    viajes = viajes.filter(viaje => viaje.id !== id);

    // Guardar de nuevo en localStorage
    localStorage.setItem("viajes", JSON.stringify(viajes));

    // Recargar la lista de viajes
    recargarViajes();

    alert("Viaje eliminado correctamente ✅");
}

// Eliminar un viaje específico por su ID
function eliminarViaje(id) {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que deseas eliminar este viaje?")) {
        return;
    }

    // Obtener viajes existentes
    let viajes = JSON.parse(localStorage.getItem("viajes")) || [];

    // Filtrar para eliminar el viaje con ese ID
    viajes = viajes.filter(viaje => viaje.id !== id);

    // Guardar de nuevo en localStorage
    localStorage.setItem("viajes", JSON.stringify(viajes));

    // Recargar la lista de viajes
    recargarViajes();

    alert("Viaje eliminado correctamente ✅");
}
