//Iconos de la slideBar 
lucide.createIcons();

import{
    GetUsuarios,
    updateUsuarios,
    deleteUsuarios,
    createUsuarios,
    userOrDuiExists,
} from "../js/usuarios.js"

// Configuración base de Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Inicializar iconos
    lucide.createIcons();
    
    // Elementos del DOM
    const container = document.getElementById('cards-container');
    const buscador = document.getElementById("buscadorClientes");
    const modal = document.getElementById("mdFormulario");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCerrar = document.getElementById("cancelInsert");
    const tituloFormulario = document.getElementById("tituloFormulario");
    const frmFormulario = document.getElementById("frmFormulario");
    
    // Variable global para almacenar usuarios
    let usuariosGlobal = [];
    
    // Cargar usuarios al iniciar
    loadUsers();
    
    // Event listeners
    buscador.addEventListener("input", handleSearch);
    btnAgregar.addEventListener("click", () => abrirFormulario());
    btnCerrar.addEventListener("click", () => modal.close());
    frmFormulario.addEventListener("submit", handleFormSubmit);
    
    // Validación del DUI
    document.getElementById("txtDuiUsuario").addEventListener("input", function () {
        let valor = this.value.replace(/[^0-9]/g, '');
        
        if (valor.length > 8) {
            valor = valor.slice(0, 8) + '-' + valor.slice(8, 9);
        }
        
        this.value = valor;
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.replace("inicio-sesion.html");
    });
    
    // Funciones principales
    async function loadUsers() {
        try {
            usuariosGlobal = await GetUsuarios();
            renderUsers(usuariosGlobal);
        } catch (err) {
            console.error('Error al cargar los datos:', err);
            container.innerHTML = '<p>Error al cargar los usuarios.</p>';
        }
    }
    
    function renderUsers(users) {
        container.innerHTML = '';
        
        if (users.length === 0) {
            container.innerHTML = "<p>No hay Usuarios registrados</p>";
            return;
        }
        
        users.forEach(user => {
            const fechaNacimiento = new Date(user.nacimiento).toLocaleDateString();


            container.innerHTML += `
                <div class="card-custom">
                    <div class="card-info">
                        <h3 class="card-title">${user.nombre} ${user.apellido}</h3>
                        <p><strong>Correo Electrónico:</strong> ${user.correo}</p>
                        <p><strong>Dui:</strong> ${user.dui}</p>
                        <p><strong>Rol:</strong> ${getNombreRol(user.idTipoUsuario)}</p>
                        <p><strong>Usuario:</strong> ${user.usuario}</p>
                        <p><strong>Contraseña:</strong> ${user.contrasena}</p>
                        <p><strong>Fecha Nacimiento:</strong> ${fechaNacimiento}</p>
                        <p><strong>Dirección:</strong> ${user.direccion}</p>
                        <div class="card-actions">
                            <button class="btn-action editar" onclick="userController.abrirFormulario(${user.idUsuario})">Editar</button>
<button class="btn-action eliminar" onclick="userController.borrarUsuario(${user.idUsuario})">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    //Funcion para los roles en vez de un inner join xq que weba
function getNombreRol(idRol) {
    const roles = {
        1: 'Admin',
        2: 'Masajista', 
        3: 'Recepcionista'
    };
    return roles[idRol] || 'Desconocido';
}

    
    
    function handleSearch() {
        const filtro = buscador.value.toLowerCase();
        
        const filtrados = usuariosGlobal.filter(usuario =>
            usuario.nombre.toLowerCase().includes(filtro) ||
            usuario.apellido.toLowerCase().includes(filtro) ||
            usuario.correo.toLowerCase().includes(filtro) ||
            usuario.usuario.toLowerCase().includes(filtro)
        );
        
        renderUsers(filtrados);
    }
    
    function abrirFormulario(userId = null) {
    if (userId) {
        const usuario = usuariosGlobal.find(u => u.idUsuario === userId);
        if (usuario) {
            tituloFormulario.textContent = "Editar Usuario";
            document.getElementById("txtIdUsuario").value = usuario.idUsuario;
            document.getElementById("txtNombreUsuario").value = usuario.nombre;
            document.getElementById("txtApellidoUsuario").value = usuario.apellido;
            document.getElementById("txtDuiUsuario").value = usuario.dui;
            document.getElementById("cmbTipoUsuario").value = usuario.idTipoUsuario;
            document.getElementById("txtUsuarioUsuario").value = usuario.usuario;
            document.getElementById("txtContrasenaUsuario").value = usuario.contrasena;
            document.getElementById("txtDireccionUsuario").value = usuario.direccion;
            document.getElementById("txtCorreoUsuario").value = usuario.correo;

            // Formatear fecha para el input date
            const fecha = new Date(usuario.nacimiento);
            const fechaFormateada = fecha.toISOString().split("T")[0];
            document.getElementById("txtFechaNacimiento").value = fechaFormateada;
        }
    } else {
        tituloFormulario.textContent = "Agregar Usuario";
        frmFormulario.reset();
        document.getElementById("txtIdUsuario").value = "";
    }
    modal.showModal();
}
    
    async function handleFormSubmit(e) {
    e.preventDefault();
    
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

    // 🔍 Validar campos vacíos
    if (!nombre || !apellido || !dui || !tipo || !usuario || !contrasena || !nacimiento || !direccion || !correo) {
        Toast.fire({ icon: "warning", title: "Completa todos los campos." });
        return;
    }

    // 🔍 Validar fecha de nacimiento (igual que antes)
    const fechaNac = new Date(nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDif = hoy.getMonth() - fechaNac.getMonth();
    const diaDif = hoy.getDate() - fechaNac.getDate();
    const esMenor = edad < 18 || (edad === 18 && (mesDif < 0 || (mesDif === 0 && diaDif < 0)));

    if (isNaN(fechaNac) || fechaNac > hoy) {
        Toast.fire({ icon: "error", title: "No puedes ingresar una fecha futura." });
        return;
    }
    if (esMenor) {
        Toast.fire({ icon: "error", title: "Debe ser mayor de 18 años." });
        return;
    }

    // 🔍 Validar existencia de usuario y DUI usando service
    const { usuario: existeUsuario, dui: existeDui } = await userOrDuiExists(usuario, dui, id);

    if (existeUsuario) {
        Toast.fire({ icon: "error", title: "El nombre de usuario ya está registrado." });
        return;
    }
    if (existeDui) {
        Toast.fire({ icon: "error", title: "El DUI ya está registrado." });
        return;
    }

    //Validar formato dui
    const duiRegex = /^\d{8}-\d$/;
    if (!duiRegex.test(dui)) {
        Toast.fire({ icon: "error", title: "El DUI debe tener el formato ########-#." });
        return;
    }

    const userData = {
        nombre,
        apellido,
        dui,
        idTipoUsuario: parseInt(tipo),
        usuario,
        contrasena,
        nacimiento: fechaNac,
        direccion,
        correo
    };

    try {
        let res;
        if (id) {
            res = await updateUsuarios(id, userData);
        } else {
            res = await createUsuarios(userData);
        }

        if (res.ok) {
            Swal.fire({
                title: "¡Éxito!",
                text: id ? "El usuario se actualizó correctamente." : "El usuario se agregó correctamente.",
                icon: "success"
            });
            frmFormulario.reset();
            modal.close();
            loadUsers();
        } else {
            Swal.fire({
                title: "Error",
                text: errorData.message || "No se pudo completar la operación.",
                icon: "error"
            });
        }
    } catch (error) {
        modal.close();
        console.error("Error en la solicitud:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al procesar la solicitud.',
            icon: 'error'
        });
    }
}
    
    async function borrarUsuario(id) {
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
                const success = await deleteUsuarios(id);
                
                if (success) {
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "El usuario se eliminó correctamente!",
                        icon: "success"
                    });
                    loadUsers(); 
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar el usuario.',
                        icon: 'error'
                    });
                }
            } catch (error) {
                console.error('Error inesperado:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado.',
                    icon: 'error'
                });
            }
        }
    });
}
    
    // Hacer funciones disponibles globalmente para los botones en las tarjetas
    window.userController = {
        abrirFormulario,
        borrarUsuario
    };
});