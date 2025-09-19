import {
  getClientes,
  getClientesPaginados,
  createCliente,
  updateCliente,
  deleteCliente
} from "../js/clientes.js";

// Configuración base de Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Elementos del DOM
  const buscador = document.getElementById("buscadorClientes");
  const tabla = document.getElementById("tablaClientes");
  const modal = document.getElementById("modalCliente");
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardar");
  const modalTitulo = document.getElementById("modalTitulo");
  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputDireccion = document.getElementById("inputDireccion");
  const inputContrasena = document.getElementById("inputContrasena");
  const errorNombre = document.getElementById("errorNombre");
  const errorCorreo = document.getElementById("errorCorreo");
  const errorDireccion = document.getElementById("errorDireccion");
  const errorContrasena = document.getElementById("errorContrasena");
  const modalConfirmacion = document.getElementById("modalConfirmacion");
  const confirmMessage = document.getElementById("confirmMessage");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const paginaActualSpan = document.getElementById("paginaActual");

  let clienteEditandoId = null;
  let todosClientes = [];
  let clientesFiltrados = [];
  let contrasenaActual = '';

  const ITEMS_POR_PAGINA = 5;
  let paginaActual = 1;
  let totalPaginas = 1;

  loadClientes();

  async function loadClientes() {
    try {
      const data = await getClientes();
      console.log('Datos recibidos:', data);
      
      if (data && Array.isArray(data)) {
        todosClientes = data;
      } else {
        console.error('Formato de datos inesperado:', data);
        todosClientes = [];
      }
      
      clientesFiltrados = [...todosClientes];
      paginaActual = 1;
      renderizarClientesPaginados();
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showErrorToast('Error al cargar clientes');
    }
  }

  // Función para renderizar clientes paginados
  function renderizarClientesPaginados() {
    tabla.innerHTML = "";
    const start = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const end = start + ITEMS_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(start, end);

    if (clientesPagina.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">
            No hay clientes registrados
          </td>
        </tr>
      `;
    } else {
      clientesPagina.forEach(cliente => {
        const fila = document.createElement("tr");
        fila.className = "border-b border-gray-200 hover:bg-gray-50";
        fila.innerHTML = `
  <td class="px-6 py-4">${cliente.nombreCompleto || ''}</td>
  <td class="px-6 py-4">${cliente.correo || ''}</td>
  <td class="px-6 py-4">${cliente.direccion || ''}</td>
  <td class="px-6 py-4 password-field">${censurarPassword(cliente.contrasenaCliente)}</td>
  <td class="px-6 py-4 flex gap-2">
    <button title="Editar" class="btnEditar text-blue-600 hover:text-blue-800" 
            data-id="${cliente.idCliente}" aria-label="Editar cliente">
      <i data-lucide="pencil"></i>
    </button>
    <button title="Eliminar" class="btnEliminar text-red-600 hover:text-red-800" 
            data-id="${cliente.idCliente}" aria-label="Eliminar cliente">
      <i data-lucide="trash-2"></i>
    </button>
  </td>
`;
        tabla.appendChild(fila);
      });
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
    actualizarBotonesPaginacion();
  }

  function actualizarBotonesPaginacion() {
    btnPrev.disabled = paginaActual <= 1;
    btnNext.disabled = paginaActual >= totalPaginas;
    paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }

  btnPrev.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarClientesPaginados();
    }
  });

  btnNext.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      renderizarClientesPaginados();
    }
  });

  buscador.addEventListener("input", () => {
    const filtro = buscador.value.toLowerCase();
    clientesFiltrados = todosClientes.filter(cliente =>
      (cliente.nombreCompleto && cliente.nombreCompleto.toLowerCase().includes(filtro)) ||
      (cliente.correo && cliente.correo.toLowerCase().includes(filtro))
    );
    paginaActual = 1;
    renderizarClientesPaginados();
  });

  btnAbrirModal.addEventListener("click", () => {
    console.log('Abriendo modal...');
    limpiarFormulario();
    limpiarErrores();
    modalTitulo.textContent = "Agregar Cliente";
    clienteEditandoId = null;
    modal.classList.remove("hidden");
    inputNombre.focus();
  });

  btnCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });

  function validarCliente() {
    limpiarErrores();
    let valido = true;

    if (!inputNombre.value.trim()) {
      mostrarError(inputNombre, errorNombre, "El nombre es obligatorio");
      valido = false;
    } else if (inputNombre.value.trim().length > 100) {
      mostrarError(inputNombre, errorNombre, "El nombre no puede superar los 100 caracteres");
      valido = false;
    }

    if (!inputCorreo.value.trim()) {
      mostrarError(inputCorreo, errorCorreo, "El correo es obligatorio");
      valido = false;
    } else if (inputCorreo.value.trim().length > 100) {
      mostrarError(inputCorreo, errorCorreo, "El correo no puede superar los 100 caracteres");
      valido = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputCorreo.value.trim())) {
        mostrarError(inputCorreo, errorCorreo, "El formato del correo no es válido");
        valido = false;
      } else if (clienteEditandoId === null && correoExistente(inputCorreo.value.trim())) {
        mostrarError(inputCorreo, errorCorreo, "El correo electrónico ya está registrado");
        valido = false;
      }
    }

    if (!inputDireccion.value.trim()) {
      mostrarError(inputDireccion, errorDireccion, "La dirección es obligatoria");
      valido = false;
    } else if (inputDireccion.value.trim().length > 100) {
      mostrarError(inputDireccion, errorDireccion, "La dirección no puede superar los 100 caracteres");
      valido = false;
    }

    if (!inputContrasena.value.trim() && clienteEditandoId === null) {
      mostrarError(inputContrasena, errorContrasena, "La contraseña es obligatoria");
      valido = false;
    } else if (inputContrasena.value.trim() && inputContrasena.value.trim().length < 8) {
      mostrarError(inputContrasena, errorContrasena, "La contraseña debe tener al menos 8 caracteres");
      valido = false;
    } else if (inputContrasena.value.trim().length > 256) {
      mostrarError(inputContrasena, errorContrasena, "La contraseña no puede superar los 256 caracteres");
      valido = false;
    }

    return valido;
  }

  function mostrarError(input, errorElement, mensaje) {
    errorElement.textContent = mensaje;
    errorElement.classList.remove("hidden");
    input.focus();
  }

  function correoExistente(correo) {
    return todosClientes.some(cliente => 
      cliente.correo.toLowerCase() === correo.toLowerCase() && 
      cliente.idCliente !== clienteEditandoId
    );
  }

  btnGuardar.addEventListener("click", async () => {
    if (!validarCliente()) return;

    const clienteData = {
      nombreCompleto: inputNombre.value.trim(),
      correo: inputCorreo.value.trim(),
      direccion: inputDireccion.value.trim(),
      contrasenaCliente: inputContrasena.value.trim() || "password123"
    };

    try {
      let response;
      if (clienteEditandoId === null) {
        response = await createCliente(clienteData);
      } else {
        if (!inputContrasena.value.trim()) {
          delete clienteData.contrasenaCliente;
        }
        response = await updateCliente(clienteEditandoId, clienteData);
      }

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: clienteEditandoId ? 
            "Cliente actualizado exitosamente" : "Cliente agregado exitosamente"
        });
        modal.classList.add("hidden");
        loadClientes();
      } else {
        const errorData = await response.json();
        
        if (response.status === 409 && errorData.campo === "correo") {
          throw new Error("El correo electrónico ya está registrado");
        } else {
          throw new Error(errorData.message || "Error al guardar cliente");
        }
      }
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      Toast.fire({
        icon: "error",
        title: err.message || "Error al guardar cliente"
      });
    }
  });

  tabla.addEventListener("click", async (e) => {
    if (e.target.closest(".btnEditar")) {
      const id = e.target.closest(".btnEditar").dataset.id;
      editarCliente(parseInt(id));
    } else if (e.target.closest(".btnEliminar")) {
      const id = e.target.closest(".btnEliminar").dataset.id;
      eliminarCliente(parseInt(id));
    }
  });

  async function editarCliente(id) {
    try {
        const cliente = todosClientes.find(c => c.idCliente === id);
        if (cliente) {
            clienteEditandoId = id;
            modalTitulo.textContent = "Editar Cliente";

            inputNombre.value = cliente.nombreCompleto || "";
            inputCorreo.value = cliente.correo || "";
            inputDireccion.value = cliente.direccion || "";
            inputContrasena.value = cliente.contrasenaCliente || ""; 


            limpiarErrores();
            modal.classList.remove("hidden");
            inputNombre.focus();
            
            passwordVisible = false;
            inputContrasena.type = 'password';
            togglePassword.innerHTML = '<i data-lucide="eye" class="h-5 w-5"></i>';
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Error al editar cliente:', error);
        Toast.fire({
            icon: "error",
            title: 'Error al cargar datos del cliente'
        });
    }
}

  function eliminarCliente(id) {
    const cliente = todosClientes.find(c => c.idCliente === id);
    if (!cliente) return;

    mostrarConfirmacion(`¿Seguro que deseas eliminar al cliente ${cliente.nombreCompleto}?`, async () => {
      try {
        const response = await deleteCliente(id);
        if (response.ok) {
          Toast.fire({
            icon: "success",
            title: "Cliente eliminado exitosamente"
          });
          loadClientes();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar cliente");
        }
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
        Toast.fire({
          icon: "error",
          title: err.message || "Error al eliminar cliente"
        });
      }
    });
  }

  function mostrarConfirmacion(mensaje, callback) {
    confirmMessage.textContent = mensaje;
    modalConfirmacion.classList.remove("hidden");

    function limpiar() {
      modalConfirmacion.classList.add("hidden");
      confirmYes.removeEventListener("click", onYes);
      confirmNo.removeEventListener("click", onNo);
    }

    function onYes() {
      limpiar();
      callback();
    }

    function onNo() {
      limpiar();
    }

    confirmYes.addEventListener("click", onYes);
    confirmNo.addEventListener("click", onNo);
  }

  function limpiarFormulario() {
    inputNombre.value = "";
    inputCorreo.value = "";
    inputDireccion.value = "";
    inputContrasena.value = "";
  }

  function limpiarErrores() {
    errorNombre.classList.add("hidden");
    errorCorreo.classList.add("hidden");
    errorDireccion.classList.add("hidden");
    errorContrasena.classList.add("hidden");
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.replace("inicio-sesion.html");
    });
  }
});

function censurarPassword(password) {
    return password ? '•'.repeat(8) : 'Sin contraseña';
}

const togglePassword = document.getElementById("togglePassword");
let passwordVisible = false;

togglePassword.addEventListener('click', function() {
    passwordVisible = !passwordVisible;
    if (passwordVisible) {
        inputContrasena.type = 'text';
        togglePassword.innerHTML = '<i data-lucide="eye-off" class="h-5 w-5"></i>';
    } else {
        inputContrasena.type = 'password';
        togglePassword.innerHTML = '<i data-lucide="eye" class="h-5 w-5"></i>';
    }
    lucide.createIcons();
});