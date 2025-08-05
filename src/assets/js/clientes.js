document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const buscador = document.getElementById("buscadorClientes");
    const tabla = document.getElementById("tablaClientes");

    const modal = document.getElementById("modalCliente");
    const modalContent = document.getElementById("modalContent");
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnGuardar = document.getElementById("btnGuardar");
    const modalTitulo = document.getElementById("modalTitulo");

    const inputNombre = document.getElementById("inputNombre");
    const inputCorreo = document.getElementById("inputCorreo");
    const inputTelefono = document.getElementById("inputTelefono");
    const inputNacimiento = document.getElementById("inputNacimiento");
    const inputDireccion = document.getElementById("inputDireccion");
    const inputEstado = document.getElementById("inputEstado");

    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorTelefono = document.getElementById("errorTelefono");
    const errorEstado = document.getElementById("errorEstado");
    const iconCorreo = document.getElementById("iconCorreo");

    const modalConfirmacion = document.getElementById("modalConfirmacion");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const paginaActualSpan = document.getElementById("paginaActual");



    let clienteEditandoIndex = null;
    let clientes = cargarClientes();

    const ITEMS_POR_PAGINA = 5;
    let paginaActual = 1;

    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener("keydown", (e) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    function actualizarBotonesPaginacion(totalItems) {
        const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);
        btnPrev.disabled = paginaActual <= 1;
        btnNext.disabled = paginaActual >= totalPaginas;
        paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    }

    function renderizarClientesPaginados(lista) {
        tabla.innerHTML = "";
        const start = (paginaActual - 1) * ITEMS_POR_PAGINA;
        const end = start + ITEMS_POR_PAGINA;
        const clientesPagina = lista.slice(start, end);

        clientesPagina.forEach((cliente, i) => {
            const fila = document.createElement("tr");
            fila.className = "cliente";
            fila.dataset.index = start + i;
            fila.innerHTML = `
        <td class="px-6 py-4">${cliente.nombre}</td>
        <td class="px-6 py-4">${cliente.correo}</td>
        <td class="px-6 py-4">${cliente.telefono}</td>
        <td class="px-6 py-4">
          <span class="${cliente.estado === 'Activo' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} px-2 py-1 rounded-full text-xs font-semibold select-none">
            ${cliente.estado}
          </span>
        </td>
        <td class="px-6 py-4 flex gap-2">
          <button title="Editar" class="btnEditar text-blue-600 hover:text-blue-800" aria-label="Editar cliente">
            <i data-lucide="pencil"></i>
          </button>
          <button title="Eliminar" class="btnEliminar text-red-600 hover:text-red-800" aria-label="Eliminar cliente">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      `;
            tabla.appendChild(fila);
        });
        lucide.createIcons();
        actualizarBotonesPaginacion(lista.length);
    }

    function limpiarFormulario() {
        inputNombre.value = "";
        inputCorreo.value = "";
        inputTelefono.value = "";
        inputNacimiento.value = "";
        inputDireccion.value = "";
        inputEstado.value = "";
        iconCorreo.classList.add("hidden");
    }

    function limpiarErrores() {
        errorNombre.classList.add("hidden");
        errorCorreo.classList.add("hidden");
        errorTelefono.classList.add("hidden");
        errorEstado.classList.add("hidden");
    }

    function guardarClientes(lista) {
        localStorage.setItem("clientes", JSON.stringify(lista));
    }

    function cargarClientes() {
        const data = localStorage.getItem("clientes");
        return data ? JSON.parse(data) : [];
    }

    function mostrarToast(mensaje, tipo = "info") {
        const contenedor = document.getElementById("toastContainer");
        const toast = document.createElement("div");

        const colores = {
            success: "bg-green-500",
            error: "bg-red-500",
            info: "bg-blue-500"
        };

        toast.className = `${colores[tipo]} text-white px-4 py-2 rounded shadow animate-fade-in`;
        toast.textContent = mensaje;

        contenedor.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("opacity-0");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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

    btnPrev.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarClientesPaginados(clientes);
        }
    });

    btnNext.addEventListener("click", () => {
        const totalPaginas = Math.ceil(clientes.length / ITEMS_POR_PAGINA);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarClientesPaginados(clientes);
        }
    });

    buscador.addEventListener("input", () => {
        const filtro = buscador.value.toLowerCase();
        const filtrados = clientes.filter(c =>
            c.nombre.toLowerCase().includes(filtro) || c.correo.toLowerCase().includes(filtro)
        );
        paginaActual = 1;
        renderizarClientesPaginados(filtrados);
    });


    btnAbrirModal.addEventListener("click", () => {
        limpiarFormulario();
        limpiarErrores();
        modalTitulo.textContent = "Agregar Cliente";
        clienteEditandoIndex = null;
        modal.classList.remove("hidden");
        trapFocus(modalContent);
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

        if (!inputNombre.value || inputNombre.value.trim().length < 3) {
            errorNombre.classList.remove("hidden");
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputCorreo.value.trim())) {
            errorCorreo.classList.remove("hidden");
            iconCorreo.classList.add("hidden");
            valido = false;
        } else {
            iconCorreo.classList.remove("hidden");
        }

        const telefonoRegex = /^\d{8,15}$/;
        if (!telefonoRegex.test(inputTelefono.value.trim())) {
            errorTelefono.classList.remove("hidden");
            valido = false;
        }

        if (!["Activo", "Inactivo"].includes(inputEstado.value)) {
            errorEstado.classList.remove("hidden");
            valido = false;
        }

        return valido;
    }

    btnGuardar.addEventListener("click", () => {
        if (!validarCliente()) return;

        const cliente = {
            nombre: inputNombre.value.trim(),
            correo: inputCorreo.value.trim(),
            telefono: inputTelefono.value.trim(),
            nacimiento: inputNacimiento.value || null,
            direccion: inputDireccion.value.trim() || null,
            estado: inputEstado.value
        };

        if (clienteEditandoIndex === null) {
            clientes.push(cliente);
            mostrarToast("Cliente agregado exitosamente", "success");
        } else {
            clientes[clienteEditandoIndex] = cliente;
            mostrarToast("Cliente actualizado exitosamente", "success");
        }

        guardarClientes(clientes);
        modal.classList.add("hidden");
        paginaActual = 1;
        buscador.value = "";
        renderizarClientesPaginados(clientes);
    });

    tabla.addEventListener("click", (e) => {
        if (e.target.closest(".btnEditar")) {
            const fila = e.target.closest("tr");
            const index = parseInt(fila.dataset.index);
            editarCliente(index);
        } else if (e.target.closest(".btnEliminar")) {
            const fila = e.target.closest("tr");
            const index = parseInt(fila.dataset.index);
            eliminarCliente(index);
        }
    });

    function editarCliente(index) {
        const c = clientes[index];
        clienteEditandoIndex = index;
        modalTitulo.textContent = "Editar Cliente";

        inputNombre.value = c.nombre;
        inputCorreo.value = c.correo;
        inputTelefono.value = c.telefono;
        inputNacimiento.value = c.nacimiento || "";
        inputDireccion.value = c.direccion || "";
        inputEstado.value = c.estado;

        limpiarErrores();
        iconCorreo.classList.remove("hidden");
        modal.classList.remove("hidden");
        trapFocus(modalContent);
        inputNombre.focus();
    }

    function eliminarCliente(index) {
        mostrarConfirmacion("¿Seguro que deseas eliminar este cliente?", () => {
            clientes.splice(index, 1);
            guardarClientes(clientes);
            mostrarToast("Cliente eliminado", "success");
            const totalPaginas = Math.ceil(clientes.length / ITEMS_POR_PAGINA);
            if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;
            renderizarClientesPaginados(clientes);
        });
    }

    renderizarClientesPaginados(clientes);
});
