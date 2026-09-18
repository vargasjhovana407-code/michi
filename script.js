/* =========================================================
   VIVA MEMORIA - JAVASCRIPT
   ========================================================= */

/* ================= DATOS ================= */

let perfil = JSON.parse(localStorage.getItem("vivaPerfil")) || {
    nombre: "",
    edad: "",
    telefono: "",
    direccion: "",
    contactoEmergencia: "",
    foto: ""
};

let recordatorios =
    JSON.parse(localStorage.getItem("vivaRecordatorios")) || [];

let eventos =
    JSON.parse(localStorage.getItem("vivaEventos")) || [];

let familia =
    JSON.parse(localStorage.getItem("vivaFamilia")) || [];

let imagenesSeleccionadas = [];
let ejercicioIniciado = false;
let tiempoMemoria = 10;
let intervaloMemoria;


/* =========================================================
   FUNCIONES GENERALES
   ========================================================= */

function guardarDatos() {
    localStorage.setItem("vivaPerfil", JSON.stringify(perfil));
    localStorage.setItem(
        "vivaRecordatorios",
        JSON.stringify(recordatorios)
    );
    localStorage.setItem("vivaEventos", JSON.stringify(eventos));
    localStorage.setItem("vivaFamilia", JSON.stringify(familia));
}

function mostrarContenido(html) {
    const contenido = document.getElementById("contenido");

    if (contenido) {
        contenido.innerHTML = html;
        window.scrollTo({
            top: contenido.offsetTop - 20,
            behavior: "smooth"
        });
    }
}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    actualizarPerfilHeader();
    actualizarSaludo();
});


function actualizarSaludo() {
    const saludo = document.getElementById("saludoUsuario");

    if (!saludo) return;

    if (perfil.nombre) {
        saludo.textContent = "¡Bienvenido/a, " + perfil.nombre + "! 👋";
    } else {
        saludo.textContent = "¡Bienvenido/a! 👋";
    }
}


function actualizarPerfilHeader() {
    const nombre = document.getElementById("nombreHeader");
    const foto = document.getElementById("fotoHeader");

    if (nombre) {
        nombre.textContent = perfil.nombre || "Mi perfil";
    }

    if (foto) {
        if (perfil.foto) {
            foto.innerHTML = `<img src="${perfil.foto}" alt="Foto de perfil">`;
        } else {
            foto.textContent = "👤";
        }
    }
}


/* =========================================================
   PANTALLA PRINCIPAL
   ========================================================= */

function mostrarInicio() {
    mostrarContenido(`
        <div class="card">
            <h2>💙 Viva Memoria</h2>
            <p>
                Aplicación de apoyo para ejercicios de memoria,
                recordatorios y organización personal.
            </p>
        </div>
    `);
}


/* =========================================================
   EJERCICIO DE MEMORIA
   ========================================================= */

function mostrarMemoria() {

    imagenesSeleccionadas = [];
    ejercicioIniciado = false;

    mostrarContenido(`
        <div class="card">
            <h2>🧠 Ejercicio de memoria</h2>

            <div class="instruccion">
                <strong>Instrucciones:</strong><br>
                Observa las 3 imágenes y trata de recordarlas.
                Tendrás unos segundos para observarlas.
                Después desaparecerán y tendrás que indicar
                cuáles recuerdas.
            </div>

            <div id="contadorMemoria" class="contador">
                Presiona "Comenzar"
            </div>

            <div id="imagenesMemoria" class="imagenes-memoria">

                <div class="imagen-memoria" data-id="flor"
                     onclick="seleccionarImagen(this)">
                    🌸
                    <span>Flor</span>
                </div>

                <div class="imagen-memoria" data-id="casa"
                     onclick="seleccionarImagen(this)">
                    🏠
                    <span>Casa</span>
                </div>

                <div class="imagen-memoria" data-id="perro"
                     onclick="seleccionarImagen(this)">
                    🐶
                    <span>Perro</span>
                </div>

            </div>

            <button class="btn" onclick="comenzarMemoria()">
                ▶️ Comenzar
            </button>

            <button class="btn btn-gray"
                    onclick="reiniciarMemoria()">
                🔄 Reiniciar
            </button>

            <div id="resultadoMemoria"></div>
        </div>
    `);
}


function comenzarMemoria() {

    if (ejercicioIniciado) return;

    ejercicioIniciado = true;
    imagenesSeleccionadas = [];

    const imagenes = document.querySelectorAll(".imagen-memoria");

    imagenes.forEach(imagen => {
        imagen.style.visibility = "visible";
        imagen.classList.remove("seleccionada");
    });

    tiempoMemoria = 10;

    const contador =
        document.getElementById("contadorMemoria");

    contador.textContent =
        "Recuerda las imágenes: " + tiempoMemoria;

    clearInterval(intervaloMemoria);

    intervaloMemoria = setInterval(function () {

        tiempoMemoria--;

        if (tiempoMemoria > 0) {
            contador.textContent =
                "Recuerda las imágenes: " + tiempoMemoria;
        } else {

            clearInterval(intervaloMemoria);

            imagenes.forEach(imagen => {
                imagen.style.visibility = "hidden";
            });

            contador.textContent =
                "¿Qué imágenes recuerdas?";

            setTimeout(() => {

                imagenes.forEach(imagen => {
                    imagen.style.visibility = "visible";
                });

            }, 500);
        }

    }, 1000);
}


function seleccionarImagen(elemento) {

    if (!ejercicioIniciado) {
        alert("Primero presiona el botón Comenzar.");
        return;
    }

    const id = elemento.dataset.id;

    if (imagenesSeleccionadas.includes(id)) {

        imagenesSeleccionadas =
            imagenesSeleccionadas.filter(
                imagen => imagen !== id
            );

        elemento.classList.remove("seleccionada");

    } else {

        imagenesSeleccionadas.push(id);
        elemento.classList.add("seleccionada");
    }

    comprobarMemoria();
}


function comprobarMemoria() {

    const resultado =
        document.getElementById("resultadoMemoria");

    if (!resultado) return;

    if (imagenesSeleccionadas.length === 3) {

        resultado.innerHTML = `
            <div class="resultado estable">
                <h3>🎉 ¡Muy bien!</h3>
                <div class="porcentaje">100%</div>
                <p>
                    Recordaste las 3 imágenes.
                    Tu memoria se encuentra estable.
                </p>
            </div>
        `;

    } else if (imagenesSeleccionadas.length === 2) {

        resultado.innerHTML = `
            <div class="resultado variable">
                <h3>👍 Buen trabajo</h3>
                <div class="porcentaje">67%</div>
                <p>
                    Recordaste 2 de las 3 imágenes.
                    Puedes seguir practicando.
                </p>
            </div>
        `;

    } else if (imagenesSeleccionadas.length === 1) {

        resultado.innerHTML = `
            <div class="resultado bajo">
                <h3>💙 Sigue practicando</h3>
                <div class="porcentaje">33%</div>
                <p>
                    Recordaste 1 de las 3 imágenes.
                    Intenta nuevamente.
                </p>
            </div>
        `;

    } else {
        resultado.innerHTML = "";
    }
}


function reiniciarMemoria() {
    clearInterval(intervaloMemoria);
    mostrarMemoria();
}


/* =========================================================
   RECORDATORIOS
   ========================================================= */

function mostrarRecordatorios() {

    let lista = "";

    if (recordatorios.length === 0) {

        lista = `
            <div class="alert">
                No tienes recordatorios registrados.
            </div>
        `;

    } else {

        recordatorios.forEach((r, indice) => {

            lista += `
                <div class="item">
                    <strong>⏰ ${r.titulo}</strong>

                    <p>
                        📅 ${r.fecha}
                    </p>

                    <p>
                        🕐 ${r.hora}
                    </p>

                    ${
                        r.descripcion
                        ? `<p>${r.descripcion}</p>`
                        : ""
                    }

                    <button class="btn btn-danger"
                        onclick="eliminarRecordatorio(${indice})">
                        🗑️ Eliminar
                    </button>
                </div>
            `;
        });
    }

    mostrarContenido(`
        <div class="card">

            <h2>⏰ Recordatorios</h2>

            <p>
                Agrega recordatorios importantes para
                organizar tus actividades.
            </p>

            <hr><br>

            <label>Nombre del recordatorio</label>

            <input
                type="text"
                id="tituloRecordatorio"
                placeholder="Ejemplo: Cita médica"
            >

            <label>Fecha</label>

            <input
                type="date"
                id="fechaRecordatorio"
            >

            <label>Hora</label>

            <input
                type="time"
                id="horaRecordatorio"
            >

            <label>Descripción</label>

            <textarea
                id="descripcionRecordatorio"
                placeholder="Escribe una descripción"
            ></textarea>

            <button class="btn"
                    onclick="agregarRecordatorio()">
                ➕ Agregar recordatorio
            </button>

            <hr><br>

            <h3>📋 Mis recordatorios</h3>

            <div id="listaRecordatorios">
                ${lista}
            </div>

        </div>
    `);
}


function agregarRecordatorio() {

    const titulo =
        document.getElementById("tituloRecordatorio").value.trim();

    const fecha =
        document.getElementById("fechaRecordatorio").value;

    const hora =
        document.getElementById("horaRecordatorio").value;

    const descripcion =
        document.getElementById("descripcionRecordatorio").value.trim();

    if (!titulo || !fecha || !hora) {

        alert(
            "Por favor completa el nombre, la fecha y la hora."
        );

        return;
    }

    recordatorios.push({
        titulo,
        fecha,
        hora,
        descripcion
    });

    guardarDatos();

    alert("Recordatorio agregado correctamente.");

    mostrarRecordatorios();
}


function eliminarRecordatorio(indice) {

    if (
        confirm(
            "¿Seguro que quieres eliminar este recordatorio?"
        )
    ) {

        recordatorios.splice(indice, 1);

        guardarDatos();

        mostrarRecordatorios();
    }
}


/* =========================================================
   CALENDARIO
   ========================================================= */

function mostrarCalendario() {

    let lista = "";

    if (eventos.length === 0) {

        lista = `
            <div class="alert">
                No tienes actividades en el calendario.
            </div>
        `;

    } else {

        eventos.forEach((evento, indice) => {

            lista += `
                <div class="item">

                    <strong>
                        📅 ${evento.titulo}
                    </strong>

                    <p>
                        Fecha: ${evento.fecha}
                    </p>

                    <p>
                        Hora: ${evento.hora}
                    </p>

                    ${
                        evento.descripcion
                        ? `<p>${evento.descripcion}</p>`
                        : ""
                    }

                    <button
                        class="btn btn-danger"
                        onclick="eliminarEvento(${indice})">
                        🗑️ Eliminar
                    </button>

                </div>
            `;
        });
    }

    mostrarContenido(`

        <div class="card">

            <h2>📅 Calendario</h2>

            <p>
                Organiza tus citas y actividades importantes.
            </p>

            <br>

            <label>Actividad</label>

            <input
                type="text"
                id="tituloEvento"
                placeholder="Ejemplo: Cumpleaños"
            >

            <label>Fecha</label>

            <input
                type="date"
                id="fechaEvento"
            >

            <label>Hora</label>

            <input
                type="time"
                id="horaEvento"
            >

            <label>Descripción</label>

            <textarea
                id="descripcionEvento"
                placeholder="Descripción de la actividad"
            ></textarea>

            <button class="btn"
                    onclick="agregarEvento()">
                ➕ Agregar actividad
            </button>

            <hr><br>

            <h3>📋 Actividades</h3>

            ${lista}

        </div>

    `);
}


function agregarEvento() {

    const titulo =
        document.getElementById("tituloEvento").value.trim();

    const fecha =
        document.getElementById("fechaEvento").value;

    const hora =
        document.getElementById("horaEvento").value;

    const descripcion =
        document.getElementById("descripcionEvento").value.trim();

    if (!titulo || !fecha || !hora) {

        alert(
            "Completa el nombre, la fecha y la hora."
        );

        return;
    }

    eventos.push({
        titulo,
        fecha,
        hora,
        descripcion
    });

    guardarDatos();

    alert("Actividad agregada correctamente.");

    mostrarCalendario();
}


function eliminarEvento(indice) {

    if (
        confirm(
            "¿Seguro que quieres eliminar esta actividad?"
        )
    ) {

        eventos.splice(indice, 1);

        guardarDatos();

        mostrarCalendario();
    }
}


/* =========================================================
   FAMILIA
   ========================================================= */

function mostrarFamilia() {

    let lista = "";

    if (familia.length === 0) {

        lista = `
            <div class="alert">
                Todavía no has agregado familiares.
            </div>
        `;

    } else {

        familia.forEach((persona, indice) => {

            lista += `
                <div class="item">

                    <strong>
                        👤 ${persona.nombre}
                    </strong>

                    <p>
                        Relación: ${persona.relacion}
                    </p>

                    <p>
                        📞 ${persona.telefono}
                    </p>

                    <button
                        class="btn btn-green"
                        onclick="llamarContacto('${persona.telefono}')">
                        📞 Llamar
                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="eliminarFamiliar(${indice})">
                        🗑️ Eliminar
                    </button>

                </div>
            `;
        });
    }

    mostrarContenido(`

        <div class="card">

            <h2>👨‍👩‍👧 Mi familia</h2>

            <p>
                Guarda los contactos de las personas
                que pueden ayudarte.
            </p>

            <br>

            <label>Nombre</label>

            <input
                type="text"
                id="nombreFamiliar"
                placeholder="Nombre del familiar"
            >

            <label>Relación</label>

            <input
                type="text"
                id="relacionFamiliar"
                placeholder="Ejemplo: Hija"
            >

            <label>Número de teléfono</label>

            <input
                type="tel"
                id="telefonoFamiliar"
                placeholder="Número de teléfono"
            >

            <button class="btn"
                    onclick="agregarFamiliar()">
                ➕ Agregar familiar
            </button>

            <hr><br>

            <h3>📞 Contactos familiares</h3>

            ${lista}

        </div>

    `);
}


function agregarFamiliar() {

    const nombre =
        document.getElementById("nombreFamiliar").value.trim();

    const relacion =
        document.getElementById("relacionFamiliar").value.trim();

    const telefono =
        document.getElementById("telefonoFamiliar").value.trim();

    if (!nombre || !telefono) {

        alert(
            "Debes ingresar el nombre y el número de teléfono."
        );

        return;
    }

    familia.push({
        nombre,
        relacion,
        telefono
    });

    guardarDatos();

    alert("Familiar agregado correctamente.");

    mostrarFamilia();
}


function eliminarFamiliar(indice) {

    if (
        confirm(
            "¿Seguro que quieres eliminar este contacto?"
        )
    ) {

        familia.splice(indice, 1);

        guardarDatos();

        mostrarFamilia();
    }
}


function llamarContacto(numero) {

    if (!numero) return;

    window.location.href =
        "tel:" + numero;
}


/* =========================================================
   PERFIL
   ========================================================= */

function mostrarPerfil() {

    mostrarContenido(`

        <div class="card perfil">

            <h2>👤 Mi perfil</h2>

            <div class="profile-photo" id="fotoPerfil">

                ${
                    perfil.foto
                    ? `<img src="${perfil.foto}"
                            alt="Foto de perfil">`
                    : "👤"
                }

            </div>

            <label>Foto de perfil</label>

            <input
                type="file"
                id="fotoInput"
                accept="image/*"
                onchange="cargarFoto(event)"
            >

            <label>Nombre completo</label>

            <input
                type="text"
                id="perfilNombre"
                value="${escapeHTML(perfil.nombre)}"
                placeholder="Escribe tu nombre"
            >

            <label>Edad</label>

            <input
                type="number"
                id="perfilEdad"
                value="${escapeHTML(perfil.edad)}"
                placeholder="Edad"
            >

            <label>Número de teléfono</label>

            <input
                type="tel"
                id="perfilTelefono"
                value="${escapeHTML(perfil.telefono)}"
                placeholder="Número de teléfono"
            >

            <label>Dirección</label>

            <textarea
                id="perfilDireccion"
                placeholder="Dónde vives"
            >${escapeHTML(perfil.direccion)}</textarea>

            <label>Contacto de emergencia</label>

            <input
                type="tel"
                id="perfilEmergencia"
                value="${escapeHTML(perfil.contactoEmergencia)}"
                placeholder="Número de emergencia"
            >

            <button
                class="btn"
                onclick="guardarPerfil()">
                💾 Guardar perfil
            </button>

            <button
                class="btn btn-gray"
                onclick="limpiarPerfil()">
                🗑️ Limpiar datos
            </button>

        </div>

    `);
}


function guardarPerfil() {

    perfil.nombre =
        document.getElementById("perfilNombre").value.trim();

    perfil.edad =
        document.getElementById("perfilEdad").value;

    perfil.telefono =
        document.getElementById("perfilTelefono").value.trim();

    perfil.direccion =
        document.getElementById("perfilDireccion").value.trim();

    perfil.contactoEmergencia =
        document.getElementById("perfilEmergencia").value.trim();

    guardarDatos();

    actualizarPerfilHeader();
    actualizarSaludo();

    alert("Perfil guardado correctamente.");

    mostrarPerfil();
}


function cargarFoto(event) {

    const archivo =
        event.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function (e) {

        perfil.foto = e.target.result;

        guardarDatos();

        actualizarPerfilHeader();

        const foto =
            document.getElementById("fotoPerfil");

        if (foto) {

            foto.innerHTML = `
                <img
                    src="${perfil.foto}"
                    alt="Foto de perfil"
                >
            `;
        }
    };

    lector.readAsDataURL(archivo);
}


function limpiarPerfil() {

    if (
        !confirm(
            "¿Quieres borrar todos los datos del perfil?"
        )
    ) {
        return;
    }

    perfil = {
        nombre: "",
        edad: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        foto: ""
    };

    guardarDatos();

    actualizarPerfilHeader();
    actualizarSaludo();

    mostrarPerfil();
}


/* =========================================================
   SEGURIDAD
   ========================================================= */

function mostrarSeguridad() {

    mostrarContenido(`

        <div class="card">

            <h2>🛡️ Seguridad</h2>

            <div class="alert">

                <strong>
                    🚨 Contacto de emergencia
                </strong>

                <p>
                    ${
                        perfil.contactoEmergencia
                        ? "Número registrado: " +
                          perfil.contactoEmergencia
                        : "Todavía no tienes un número de emergencia."
                    }
                </p>

            </div>

            ${
                perfil.contactoEmergencia
                ? `
                    <button
                        class="btn btn-danger"
                        onclick="llamarEmergencia()">
                        🚨 Llamar a emergencia
                    </button>
                `
                : `
                    <button
                        class="btn"
                        onclick="mostrarPerfil()">
                        👤 Configurar contacto
                    </button>
                `
            }

            <div class="instruccion">

                <h3>🔐 Recomendaciones</h3>

                <p>
                    • Mantén tus contactos familiares actualizados.
                </p>

                <p>
                    • Guarda un número de emergencia.
                </p>

                <p>
                    • No compartas información personal
                    con personas desconocidas.
                </p>

            </div>

        </div>

    `);
}


function llamarEmergencia() {

    if (!perfil.contactoEmergencia) {

        alert(
            "Primero registra un contacto de emergencia."
        );

        return;
    }

    if (
        confirm(
            "¿Quieres llamar al contacto de emergencia?"
        )
    ) {

        window.location.href =
            "tel:" + perfil.contactoEmergencia;
    }
}


/* =========================================================
   ALERTAS AUTOMÁTICAS DE RECORDATORIOS
   ========================================================= */

function comprobarRecordatorios() {

    const ahora = new Date();

    const fechaActual =
        ahora.toISOString().split("T")[0];

    const horaActual =
        String(ahora.getHours()).padStart(2, "0") +
        ":" +
        String(ahora.getMinutes()).padStart(2, "0");

    recordatorios.forEach(recordatorio => {

        if (
            recordatorio.fecha === fechaActual &&
            recordatorio.hora === horaActual
        ) {

            alert(
                "⏰ Recordatorio de Viva Memoria\n\n" +
                recordatorio.titulo +
                "\n\n" +
                (recordatorio.descripcion || "")
            );
        }
    });
}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escapeHTML(texto) {

    if (!texto) return "";

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   COMPROBAR RECORDATORIOS CADA MINUTO
   ========================================================= */

setInterval(
    comprobarRecordatorios,
    60000
);