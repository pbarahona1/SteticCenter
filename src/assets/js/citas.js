lucide.createIcons();
    const sidebar = document.querySelector("aside");
    const mainContent = document.querySelector(".main-content");
    sidebar.addEventListener("mouseenter", () => mainContent.classList.add("sidebar-open"));
    sidebar.addEventListener("mouseleave", () => mainContent.classList.remove("sidebar-open"));

    const tabla = document.getElementById("tablaCitas");
    const buscador = document.getElementById("buscadorCitas");
    const modal = document.getElementById("modalCita");
    const btnNueva = document.getElementById("btnNuevaCita");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnCancelar = document.getElementById("btnCancelar");
    const modalTitulo = document.getElementById("modalTitulo");

    const inputCliente = document.getElementById("inputCliente");
    const inputServicio = document.getElementById("inputServicio");
    const inputFecha = document.getElementById("inputFecha");
    const inputHora = document.getElementById("inputHora");
    const inputEmpleado = document.getElementById("inputEmpleado");
    const inputEstado = document.getElementById("inputEstado");

    const toastContainer = document.getElementById("toastContainer");

    const serviciosSpa = ["Masaje relajante", "Facial hidratante", "Terapia con piedras calientes", "Exfoliación corporal", "Tratamiento anti-estrés"];
    const empleadosSpa = ["Laura", "Pedro", "Sofía", "Andrés", "María"];

    serviciosSpa.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      inputServicio.appendChild(opt);
    });
    empleadosSpa.forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      inputEmpleado.appendChild(opt);
    });

    let citas = JSON.parse(localStorage.getItem("citas")) || [];
    let citaEditandoIndex = null;

    function mostrarToast(msg, tipo="success") {
      const colores = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500" };
      const toast = document.createElement("div");
      toast.className = `${colores[tipo]} text-white px-4 py-2 rounded shadow toast`;
      toast.textContent = msg;
      toastContainer.appendChild(toast);
      setTimeout(() => toast.remove(), 10000000);
    }

    function limpiarModal() {
      inputCliente.value = "";
      inputServicio.value = "";
      inputFecha.value = "";
      inputHora.value = "";
      inputEmpleado.value = "";
      inputEstado.value = "";
    }

    function renderizarTabla(filtro="") {
      tabla.innerHTML = "";
      citas
        .filter(c => c.cliente.toLowerCase().includes(filtro) || c.servicio.toLowerCase().includes(filtro) || c.empleado.toLowerCase().includes(filtro))
        .forEach((cita, index) => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td class="px-4 py-2">${cita.cliente}</td>
            <td class="px-4 py-2">${cita.servicio}</td>
            <td class="px-4 py-2">${cita.fecha}</td>
            <td class="px-4 py-2">${cita.hora}</td>
            <td class="px-4 py-2">${cita.empleado}</td>
            <td class="px-4 py-2">${cita.estado}</td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="text-blue-600 hover:text-blue-800" onclick="editarCita(${index})"><i data-lucide="pencil"></i></button>
              <button class="text-red-600 hover:text-red-800" onclick="eliminarCita(${index})"><i data-lucide="x"></i></button>
            </td>
          `;
          tabla.appendChild(fila);
        });
      lucide.createIcons();
    }

    function validarCampos() {
      if (!inputCliente.value.trim() || !inputServicio.value || !inputFecha.value || !inputHora.value || !inputEmpleado.value || !inputEstado.value) {
        mostrarToast("Todos los campos son obligatorios", "error");
        return false;
      }
      return true;
    }

    btnNueva.addEventListener("click", () => {
      limpiarModal();
      modalTitulo.textContent = "Agregar Cita";
      citaEditandoIndex = null;
      modal.classList.remove("hidden");
    });

    btnCancelar.addEventListener("click", () => modal.classList.add("hidden"));

    btnGuardar.addEventListener("click", () => {
      if (!validarCampos()) return;
      const nuevaCita = {
        cliente: inputCliente.value.trim(),
        servicio: inputServicio.value,
        fecha: inputFecha.value,
        hora: inputHora.value,
        empleado: inputEmpleado.value,
        estado: inputEstado.value
      };
      if (citaEditandoIndex === null) {
        citas.push(nuevaCita);
        mostrarToast("Cita agregada con éxito", "success");
      } else {
        citas[citaEditandoIndex] = nuevaCita;
        mostrarToast("Cita actualizada", "info");
      }
      localStorage.setItem("citas", JSON.stringify(citas));
      renderizarTabla();
      modal.classList.add("hidden");
    });

    buscador.addEventListener("input", (e) => renderizarTabla(e.target.value.toLowerCase()));

    window.editarCita = (index) => {
      const c = citas[index];
      citaEditandoIndex = index;
      modalTitulo.textContent = "Editar Cita";
      inputCliente.value = c.cliente;
      inputServicio.value = c.servicio;
      inputFecha.value = c.fecha;
      inputHora.value = c.hora;
      inputEmpleado.value = c.empleado;
      inputEstado.value = c.estado;
      modal.classList.remove("hidden");
    };

    window.eliminarCita = (index) => {
      citas.splice(index, 1);
      localStorage.setItem("citas", JSON.stringify(citas));
      renderizarTabla();
      mostrarToast("Cita eliminada", "success");
    };

    renderizarTabla(); 