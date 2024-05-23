// Función para cargar los contactos al iniciar la página
function cargarContactos() {
    fetch('http://localhost:8080/usuarios')
    .then(response => response.json())
    .then(contactos => {
        const agendaDiv = document.getElementById('agenda');
        agendaDiv.innerHTML = '';
        contactos.forEach(contacto => {
            agendaDiv.innerHTML += `
                <div class="contacto">
                    <p><strong>Nombre:</strong> ${contacto.nombre}</p>
                    <p><strong>Teléfono:</strong> ${contacto.telefono}</p>
                    <p><strong>Email:</strong> ${contacto.email}</p>
                    <p><strong>Cédula:</strong> ${contacto.cedula}</p>
                    <button class="editar" onclick="editarContacto(${contacto.cedula}, '${contacto.nombre}', '${contacto.telefono}', '${contacto.email}')">Editar</button>
                    <button class="eliminar" onclick="eliminarContacto(${contacto.cedula})">Eliminar</button>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error al cargar contactos:', error));
}

// Función para agregar o editar un contacto
function agregarEditarContacto(event) {
    event.preventDefault();
    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;

    const nuevoContacto = { nombre, telefono, email, cedula };

    let url = 'http://localhost:8080/usuarios';
    let method = 'POST';
    let message = '';

    if (document.getElementById('cedula').disabled === true) {
        url += `/${cedula}`;
        method = 'PUT';
        message = '¡Contacto actualizado exitosamente!';
    } else {
        message = '¡Contacto guardado exitosamente!';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoContacto)
    })
    .then(response => {
        if (response.ok) {
            cargarContactos();
            limpiarFormulario();
            document.getElementById('cedula').disabled = false;
            showNotification(message);
        } else {
            throw new Error('Error al agregar/editar contacto');
        }
    })
    .catch(error => {
        console.error('Error al agregar/editar contacto:', error);
        showNotification('¡Error al editar contacto!');
    });
}

// Función para eliminar un contacto
function eliminarContacto(cedula) {
    fetch(`http://localhost:8080/usuarios/${cedula}`, {
        method: 'DELETE'
    })
    .then(() => {
        cargarContactos();
        showNotification('¡Contacto eliminado exitosamente!');
    })
    .catch(error => {
        console.error('Error al eliminar contacto:', error);
        showNotification('¡Error al eliminar contacto!');
    });
}

// Función para editar un contacto
function editarContacto(cedula, nombre, telefono, email) {
    document.getElementById('cedula').value = cedula;
    document.getElementById('nombre').value = nombre;
    document.getElementById('telefono').value = telefono;
    document.getElementById('email').value = email;
    
    // Si hay una cédula, deshabilita el campo de cédula
    if (cedula) {
        document.getElementById('cedula').disabled = true;
    } else {
        document.getElementById('cedula').disabled = false;
    }

    // Mostrar la página de edición
    mostrarPagina('form-agregar');
}
// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('form-agregar-contacto').reset();
    document.getElementById('cedula').value = '';
    document.getElementById('cedula').disabled = false; // Habilitar el campo de cédula
}

// Función para buscar contactos
function buscarContactos() {
    const filtro = document.getElementById('buscar').value.toUpperCase();
    const contactos = document.querySelectorAll('.contacto');

    contactos.forEach(contacto => {
        const nombre = contacto.getElementsByTagName('p')[0].innerText.toUpperCase();
        const telefono = contacto.getElementsByTagName('p')[1].innerText.toUpperCase();
        const email = contacto.getElementsByTagName('p')[2].innerText.toUpperCase();
        const cedula = contacto.getElementsByTagName('p')[3].innerText.toUpperCase();

        if (nombre.includes(filtro) || telefono.includes(filtro) || email.includes(filtro) || cedula.includes(filtro)) {
            contacto.style.display = '';
        } else {
            contacto.style.display = 'none';
        }
    });
}

// Función para mostrar una página específica
function mostrarPagina(pagina) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
    });

    // Mostrar la página deseada
    document.getElementById(pagina).style.display = 'block';

    // Si estamos volviendo a la página de lista y el campo de cédula está deshabilitado
    if (pagina === 'agenda' && document.getElementById('cedula').disabled) {
        // Habilitar el campo de cédula
        document.getElementById('cedula').disabled = false;
    }
}

// Función para mostrar la notificación flotante
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000); // Oculta la notificación después de 3 segundos
}

// Función para mostrar la página seleccionada
function mostrarPagina(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');

    document.getElementById(page).style.display = 'block';

    if (page === 'agenda') {
        cargarContactos();
    }
}

// Event Listeners
document.getElementById('form-agregar-contacto').addEventListener('submit', agregarEditarContacto);
document.getElementById('buscar').addEventListener('input', buscarContactos);
mostrarPagina('agenda'); // Mostrar la página de listar y buscar contactos por defecto
