import {
  getCitas,
  getCitasPaginadas,
  createCita,
  updateCita,
  deleteCita,
  getUsuarios,
  getHorarios
} from "../js/citas.js";

import { getClientes } from "../js/clientes.js";

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

document.addEventListener("DOMContentLoaded", async () => {
  // Inicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Elementos del DOM
  const buscador = document.getElementById("buscadorCitas");
  const tabla = document.getElementById("tablaCitas");
  const modal = document.getElementById("modalCita");
  const btnNuevaCita = document.getElementById("btnNuevaCita");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnGuardar = document.getElementById("btnGuardar");
  const modalTitulo = document.getElementById("modalTitulo");
  const selectCliente = document.getElementById("inputCliente");
  const selectUsuario = document.getElementById("inputEmpleado");
  const selectHorario = document.getElementById("inputHorario");
  const inputFecha = document.getElementById("inputFecha");
  const selectEstado = document.getElementById("inputEstado");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const paginaActualSpan = document.getElementById("paginaActual");

  let citaEditandoId = null;
  let todasCitas = [];
  let citasFiltradas = [];
  let clientesLista = [];
  let usuariosLista = [];
  let horariosLista = [];

  const ITEMS_POR_PAGINA = 5;
  let paginaActual = 1;
  let totalPaginas = 1;

  // Inicializar
  await cargarDatosCombos();
  await loadCitas();

  // Función para cargar datos de combos
  async function cargarDatosCombos() {
    try {
      // Cargar clientes
      clientesLista = await getClientes();
      selectCliente.innerHTML = '<option value="" disabled selected>Seleccionar cliente</option>';
      clientesLista.forEach(cliente => {
        const option = document.createElement("option");
        option.value = cliente.idCliente;
        option.textContent = cliente.nombreCompleto;
        selectCliente.appendChild(option);
      });

      // Cargar usuarios (empleados)
      usuariosLista = await getUsuarios();
      selectUsuario.innerHTML = '<option value="" disabled selected>Seleccionar empleado</option>';
      usuariosLista.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.idUsuario;
        option.textContent = usuario.nombreCompleto || usuario.nombre;
        selectUsuario.appendChild(option);
      });

      // Cargar horarios
      horariosLista = await getHorarios();
      selectHorario.innerHTML = '<option value="" disabled selected>Seleccionar horario</option>';
      horariosLista.forEach(horario => {
        const option = document.createElement("option");
        option.value = horario.idHorario;
        option.textContent = horario.descripcion;
        selectHorario.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar datos para combos:', error);
      Toast.fire({
        icon: "error",
        title: 'Error al cargar datos'
      });
    }
  }

  // Función para cargar citas
  async function loadCitas() {
    try {
      const data = await getCitas();
      
      if (data && Array.isArray(data)) {
        todasCitas = data;
      } else {
        console.error('Formato de datos inesperado:', data);
        todasCitas = [];
      }
      
      citasFiltradas = [...todasCitas];
      paginaActual = 1;
      renderizarCitasPaginadas();
    } catch (error) {
      console.error('Error al cargar citas:', error);
      Toast.fire({
        icon: "error",
        title: 'Error al cargar citas'
      });
    }
  }

// Reemplaza la función obtenerNombrePorId con esta versión mejorada
function obtenerNombrePorId(lista, id, campoId = 'id', campoNombre = 'nombreCompleto') {
    if (!lista || !id) return 'No especificado';
    
    const item = lista.find(item => item[campoId] == id);
    
    if (!item) return 'No encontrado';
    
    // Para usuarios, concatenar nombre y apellido
    if (item.nombre && item.apellido) {
        return `${item.nombre} ${item.apellido}`;
    }
    
    // Para otros casos, usar el campo especificado o un valor por defecto
    return item[campoNombre] || 'Sin nombre';
}
  

  // Función para renderizar citas paginadas
function renderizarCitasPaginadas() {
    tabla.innerHTML = "";
    const start = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const end = start + ITEMS_POR_PAGINA;
    const citasPagina = citasFiltradas.slice(start, end);

    if (citasPagina.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No hay citas registradas
                </td>
            </tr>
        `;
    } else {
        citasPagina.forEach(cita => {
            const fila = document.createElement("tr");
            fila.className = "border-b border-gray-200 hover:bg-gray-50";
            fila.innerHTML = `
                <td class="px-6 py-4">${obtenerNombrePorId(clientesLista, cita.idCliente, 'idCliente')}</td>
                <td class="px-6 py-4">${obtenerNombrePorId(usuariosLista, cita.idUsuario, 'idUsuario')}</td>
                <td class="px-6 py-4">${cita.fecha_cita ? new Date(cita.fecha_cita).toLocaleDateString() : 'Fecha no válida'}</td>
                <td class="px-6 py-4">${obtenerNombrePorId(horariosLista, cita.idHorario, 'idHorario', 'descripcion')}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${getEstadoClass(cita.estado)}">
                        ${cita.estado || 'Sin estado'}
                    </span>
                </td>
                <td class="px-6 py-4 flex gap-2">
                    <button title="Editar" class="btnEditar text-blue-600 hover:text-blue-800" 
                            data-id="${cita.idCita}" aria-label="Editar cita">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button title="Eliminar" class="btnEliminar text-red-600 hover:text-red-800" 
                            data-id="${cita.idCita}" aria-label="Eliminar cita">
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

    totalPaginas = Math.ceil(citasFiltradas.length / ITEMS_POR_PAGINA);
    actualizarBotonesPaginacion();
}

  // Función para obtener clase CSS según estado
  function getEstadoClass(estado) {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-200 text-yellow-800';
      case 'CONFIRMADA': return 'bg-green-200 text-green-800';
      case 'CANCELADA': return 'bg-red-200 text-red-800';
      case 'COMPLETADA': return 'bg-blue-200 text-blue-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  // Función para actualizar botones de paginación
  function actualizarBotonesPaginacion() {
    btnPrev.disabled = paginaActual <= 1;
    btnNext.disabled = paginaActual >= totalPaginas;
    paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }

  // Event listeners para paginación
  btnPrev.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarCitasPaginadas();
    }
  });

  btnNext.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      renderizarCitasPaginadas();
    }
  });

  // Búsqueda de citas
  buscador.addEventListener("input", () => {
    const filtro = buscador.value.toLowerCase();
    citasFiltradas = todasCitas.filter(cita => {
      const clienteNombre = obtenerNombrePorId(clientesLista, cita.idCliente, 'idCliente').toLowerCase();
      const usuarioNombre = obtenerNombrePorId(usuariosLista, cita.idUsuario, 'idUsuario').toLowerCase();
      const horarioDesc = obtenerNombrePorId(horariosLista, cita.idHorario, 'idHorario', 'descripcion').toLowerCase();
      
      return clienteNombre.includes(filtro) || 
             usuarioNombre.includes(filtro) || 
             horarioDesc.includes(filtro) ||
             cita.estado.toLowerCase().includes(filtro);
    });
    paginaActual = 1;
    renderizarCitasPaginadas();
  });

  // Abrir modal para agregar cita
  btnNuevaCita.addEventListener("click", () => {
    limpiarFormulario();
    modalTitulo.textContent = "Agregar Cita";
    citaEditandoId = null;
    modal.classList.remove("hidden");
  });

  // Cerrar modal
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

  // Validación de formulario
  function validarCita() {
    let valido = true;

    if (!selectCliente.value) {
      Toast.fire({
        icon: "error",
        title: "Seleccione un cliente"
      });
      valido = false;
    }

    if (!selectUsuario.value) {
      Toast.fire({
        icon: "error",
        title: "Seleccione un empleado"
      });
      valido = false;
    }

    if (!selectHorario.value) {
      Toast.fire({
        icon: "error",
        title: "Seleccione un horario"
      });
      valido = false;
    }

    if (!inputFecha.value) {
      Toast.fire({
        icon: "error",
        title: "Seleccione una fecha"
      });
      valido = false;
    }

    if (!selectEstado.value) {
      Toast.fire({
        icon: "error",
        title: "Seleccione un estado"
      });
      valido = false;
    }

    return valido;
  }

  // Guardar cita
  btnGuardar.addEventListener("click", async () => {
    if (!validarCita()) return;

    const citaData = {
      idUsuario: parseInt(selectUsuario.value),
      idCliente: parseInt(selectCliente.value),
      idHorario: parseInt(selectHorario.value),
      fecha_cita: inputFecha.value,
      estado: selectEstado.value
    };

    try {
      let response;
      if (citaEditandoId === null) {
        response = await createCita(citaData);
      } else {
        citaData.idCita = citaEditandoId;
        response = await updateCita(citaEditandoId, citaData);
      }

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: citaEditandoId ? 
            "Cita actualizada exitosamente" : "Cita agregada exitosamente"
        });
        modal.classList.add("hidden");
        loadCitas();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar cita");
      }
    } catch (err) {
      console.error('Error al guardar cita:', err);
      Toast.fire({
        icon: "error",
        title: err.message || "Error al guardar cita"
      });
    }
  });

  // Editar cita
  tabla.addEventListener("click", async (e) => {
    if (e.target.closest(".btnEditar")) {
      const id = e.target.closest(".btnEditar").dataset.id;
      editarCita(parseInt(id));
    } else if (e.target.closest(".btnEliminar")) {
      const id = e.target.closest(".btnEliminar").dataset.id;
      eliminarCita(parseInt(id));
    }
  });

  async function editarCita(id) {
    try {
      const cita = todasCitas.find(c => c.idCita === id);
      if (cita) {
        citaEditandoId = id;
        modalTitulo.textContent = "Editar Cita";

        selectCliente.value = cita.idCliente;
        selectUsuario.value = cita.idUsuario;
        selectHorario.value = cita.idHorario;
        inputFecha.value = new Date(cita.fecha_cita).toISOString().split('T')[0];
        selectEstado.value = cita.estado;

        modal.classList.remove("hidden");
      }
    } catch (error) {
      console.error('Error al editar cita:', error);
      Toast.fire({
        icon: "error",
        title: 'Error al cargar datos de la cita'
      });
    }
  }

  // Eliminar cita
  function eliminarCita(id) {
    const cita = todasCitas.find(c => c.idCita === id);
    if (!cita) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la cita del cliente ${obtenerNombrePorId(clientesLista, cita.idCliente, 'idCliente')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCita(id);
          if (response.ok) {
            Toast.fire({
              icon: "success",
              title: "Cita eliminada exitosamente"
            });
            loadCitas();
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar cita");
          }
        } catch (err) {
          console.error('Error al eliminar cita:', err);
          Toast.fire({
            icon: "error",
            title: err.message || "Error al eliminar cita"
          });
        }
      }
    });
  }

  // Funciones auxiliares
  function limpiarFormulario() {
    selectCliente.value = "";
    selectUsuario.value = "";
    selectHorario.value = "";
    inputFecha.value = "";
    selectEstado.value = "";
  }
});

// Cerrar sesión
document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.replace("inicio-sesion.html");
    });
  }
});