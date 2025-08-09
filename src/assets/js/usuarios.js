//Iconos de la slideBar 
lucide.createIcons();
// Escuchar cambios en el input de búsqueda
const buscador = document.getElementById("buscadorClientes");
//Retool
const API_URL = "https://retoolapi.dev/r77FF6/Usuarios1";
const container = document.getElementById('cards-container');


//CargarTarjetas
async function CargarUsuarios() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        UsuariosGlobal = data;
        CargarTarjetas(data);
    } catch {
        console.error('Error al cargar lo datos:', err);
        container.innerHTML = '<p>Error al cargar los usuarios.</p>';
    }
}


//Cargar Usuarios
function CargarTarjetas(Usuarios) {
    container.innerHTML = '';

    if (Usuarios.length == 0) {
        //Si "Usuarios" esta vacio, entonces:
        container.innerHTML = "<p>No hay Usuarios registradas</p>";
        return; //Evita que el codigo se siga ejecutando
    }


    Usuarios.forEach(Usuarios => {
        container.innerHTML += `
  <div class="card-custom">
    <div class="card-info">
      <h3 class="card-title">Nombre: ${Usuarios.nombre}</h3>
      <p>Apellido: ${Usuarios.apellido}</p>
      <p>Correo Electronico: ${Usuarios.correo}</p>
      <p>Dui: ${Usuarios.dui}</p>
      <p>Rol: ${Usuarios.idTipoUsuario}</p>
      <p>Usuario: ${Usuarios.usuario}</p>
      <p>Contrasena: ${Usuarios.contrasena}</p>
      <p>Fecha de nacimiento: ${Usuarios.nacimiento}</p>
      <p>Direccion: ${Usuarios.direccion}</p>
      <div class="card-actions">
        <button class="btn-action editar" onclick="abrirFormulario(UsuariosGlobal.find(c => c.id == '${Usuarios.id}'))">Editar</button>
        <button class="btn-action eliminar" onclick="BorrarUsuarios('${Usuarios.id}')">Eliminar</button>
      </div>
    </div>
  </div>
`;
    });
}

//Buscador
buscador.addEventListener("input", () => {
    const filtro = buscador.value.toLowerCase();

    const filtrados = UsuariosGlobal.filter(usuario =>
        usuario.nombre.toLowerCase().includes(filtro) ||
        usuario.apellido.toLowerCase().includes(filtro) ||
        usuario.correo.toLowerCase().includes(filtro) ||
        usuario.usuario.toLowerCase().includes(filtro)
    );

    CargarTarjetas(filtrados);
});


// Dialogo modal
const modal = document.getElementById("mdFormulario");
const btnAgregar = document.getElementById("btnAgregar");
const btnCerrar = document.getElementById("cancelInsert");
const tituloFormulario = document.getElementById("tituloFormulario");
const frmFormulario = document.getElementById("frmFormulario");
const tbody = document.getElementById("clientes-tbody");

// Abrir dialog al darle click al botón de agregar
btnAgregar.addEventListener("click", () => {
    abrirFormulario();
});

// Cerrar el dialog al darle click al botón de cancelar
btnCerrar.addEventListener("click", () => {
    modal.close();
});



function abrirFormulario(usuario = null) {
    if (usuario) {
        tituloFormulario.textContent = "Editar Usuario";
        document.getElementById("txtIdUsuario").value = usuario.id; // Asumiendo que el objeto tiene una propiedad 'id'
        document.getElementById("txtNombreUsuario").value = usuario.nombre; // Asumiendo 'nombre'
        document.getElementById("txtApellidoUsuario").value = usuario.apellido; // Asumiendo 'apellido'
        document.getElementById("txtDuiUsuario").value = usuario.dui; // Asumiendo 'dui'
        document.getElementById("txtFechaNacimiento").value = usuario.nacimiento; // Asumiendo 'fechaNacimiento'
        document.getElementById("cmbTipoUsuario").value = usuario.idTipoUsuario; // Asumiendo 'tipo'
        document.getElementById("txtUsuarioUsuario").value = usuario.usuario;
        document.getElementById("txtContrasenaUsuario").value = usuario.contrasena;
        document.getElementById("txtDireccionUsuario").value = usuario.direccion;
        document.getElementById("txtCorreoUsuario").value = usuario.correo;

    } else {
        tituloFormulario.textContent = "Agregar Cliente";
        frmFormulario.reset();
        document.getElementById("txtIdUsuario").value = "";
    }
    modal.showModal();
}

//Validacion del DUI
document.getElementById("txtDuiUsuario").addEventListener("input", function () {
    let valor = this.value.replace(/[^0-9]/g, ''); // Quita todo lo que no sea número

    if (valor.length > 8) {
        valor = valor.slice(0, 8) + '-' + valor.slice(8, 9); // Inserta el guion en la posición 9
    }

    this.value = valor;
});


//Guardar campos de editar y agregar
document.getElementById("frmFormulario").addEventListener("submit", async e => {
    e.preventDefault();

    // Obtener valores del formulario
    const id = document.getElementById("txtIdUsuario").value;
    const nombre = document.getElementById("txtNombreUsuario").value.trim();
    const apellido = document.getElementById("txtApellidoUsuario").value.trim();
    const dui = document.getElementById("txtDuiUsuario").value.trim();
    const tipo = document.getElementById("cmbTipoUsuario").value.trim();
    const usuario = document.getElementById("txtUsuarioUsuario").value.trim();
    const contrasena = document.getElementById("txtContrasenaUsuario").value.trim();
    const nacimiento = document.getElementById("txtFechaNacimiento").value.trim();
    const direccion = document.getElementById("txtDireccionUsuario").value.trim();
    const correo = document.getElementById("txtCorreoUsuario").value.trim();

    // Validar campos
    if (!nombre || !apellido || !dui || !tipo || !usuario || !contrasena || !nacimiento || !direccion || !correo) {
        Swal.fire({
            title: "Campos incompletos",
            text: "Por favor completa todos los campos.",
            icon: "warning"
        });
        return;
    }



    const nuevoUsuario = {
        nombre,
        apellido,
        dui,
        idTipoUsuario: tipo,
        usuario,
        contrasena,
        nacimiento,
        direccion,
        correo
    };

    try {
        let res;
        let esEdicion = false;

        if (id) {
            // Editar usuario
            esEdicion = true;
            res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
        } else {
            // Agregar usuario
            res = await fetch(API_URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
        }

        if (res.ok) {
            Swal.fire({
                title: "¡Éxito!",
                text: esEdicion ? "El empleado se actualizó correctamente." : "El empleado se agregó correctamente.",
                icon: "success"
            });

            frmFormulario.reset();
            modal.close();
            CargarUsuarios();
        } else {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar el empleado.",
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al procesar la solicitud.',
            icon: 'error'
        });
    }
});


/*Borrar a la juana la cubana*/
async function BorrarUsuarios(id) {
    Swal.fire({
        title: '¿Eliminar este Usuario?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e3342f',
        cancelButtonColor: '#6c757d'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire({
                        title: "Exito!",
                        text: "El empleado se elimino correctamente!",
                        icon: "success"
                    });
                    CargarUsuarios();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar el usuario.',
                        icon: 'error'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado.',
                    icon: 'error'
                });
            }
        }
    });
}

//Cargar al abrir 
window.addEventListener('DOMContentLoaded', CargarUsuarios)

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.replace("inicio-sesion.html");
    });
});

