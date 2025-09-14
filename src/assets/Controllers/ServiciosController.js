//Iconos de la slideBar 
lucide.createIcons();

import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  getPaquetes,
  createPaquete,
  updatePaquete,
  deletePaquete,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  uploadImageToCloudinary
} from "../js/servicios.js";

// Configuración base de Toast
function showErrorToast(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

function showSuccessToast(message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos
  lucide.createIcons();

  // Elementos del DOM
  const cardsContainer = document.getElementById("cardsContainer");
  const searchInput = document.getElementById("searchInput");
  const modal = document.getElementById("modalForm");
  const closeModal = document.getElementById("closeModal");
  const formRegistro = document.getElementById("formRegistro");
  const modalTitle = document.getElementById("modalTitle");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnServicios = document.getElementById("btnServicios");
  const btnPaquetes = document.getElementById("btnPaquetes");
  const btnProductos = document.getElementById("btnProductos");

  let currentType = "servicios";
  let allData = [];
  let editingId = null;

  // Event listeners
  btnAgregar.addEventListener("click", () => openModal());
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.style.overflow = '';
  });
  
  formRegistro.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", handleSearch);

  btnServicios.addEventListener("click", () => loadData("servicios"));
  btnPaquetes.addEventListener("click", () => loadData("paquetes"));
  btnProductos.addEventListener("click", () => loadData("productos"));

  // Validación de imágenes
  document.getElementById('imagen').addEventListener('change', function() {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    const file = this.files[0];
    
    if (!file) return;
    
    // Validar tipo de imagen
    if (!allowedTypes.includes(file.type)) {
        showErrorToast('Formato no permitido. Use JPEG, JPG O PNG ');
        this.value = "";
        return false;
    }
    
    // Validar tamaño de imagen
    if (file.size > maxSize) {
        showErrorToast('Imagen muy grande. Máximo 5MB permitido');
        this.value = "";
        return false;
    }
    
    // Mostrar información de la imagen válida
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    showSuccessToast(`Imagen válida: ${file.name} (${fileSizeMB} MB)`);
  });

  // Cargar datos por defecto
  loadData("servicios");

  // Función para obtener el nombre del campo ID según el tipo
  function getIdFieldName(type) {
    switch(type) {
      case 'servicios': return 'idServicio';
      case 'paquetes': return 'idPaquete';
      case 'productos': return 'idProducto';
      default: return 'id';
    }
  }

  // Función para obtener el ID correcto según el tipo de entidad
  function getIdFromItem(item, type) {
    const idField = getIdFieldName(type);
    return item[idField] || item.id;
  }

  // Función para encontrar un registro por ID
  function findItemById(type, id) {
    const idField = getIdFieldName(type);
    return allData.find(item => item[idField] === id || item.id === id);
  }

  // Función para actualizar botones activos
  function updateActiveButton(activeType) {
    [btnServicios, btnPaquetes, btnProductos].forEach(btn => {
      btn.classList.remove('bg-pink-600', 'text-white');
      btn.classList.add('bg-gray-300');
    });
    
    const activeBtn = document.getElementById(`btn${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`);
    if (activeBtn) {
      activeBtn.classList.add('bg-pink-600', 'text-white');
      activeBtn.classList.remove('bg-gray-300');
    }
  }

  // Cargar datos
  async function loadData(type) {
    currentType = type;
    updateActiveButton(type);
    cardsContainer.innerHTML = "<p class='col-span-full text-center'>Cargando...</p>";

    try {
      let data;
      if (type === "servicios") {
        data = await getServicios();
      } else if (type === "paquetes") {
        data = await getPaquetes();
      } else if (type === "productos") {
        data = await getProductos();
      }
      

      
      allData = Array.isArray(data) ? data : [];
      renderCards(allData);
    } catch (error) {
      console.error(error);
      cardsContainer.innerHTML = "<p class='col-span-full text-center text-red-500'>Error al cargar datos</p>";
    }
  }

  // Renderizar tarjetas
  function renderCards(data) {
    if (!data.length) {
      cardsContainer.innerHTML = "<p class='col-span-full text-center'>No hay registros</p>";
      return;
    }
    
    cardsContainer.innerHTML = data.map(item => {
      const itemId = getIdFromItem(item, currentType);

      return `
      <div class="bg-white shadow rounded-lg overflow-hidden card">
        <div class="card-image-container">
          <img src="${item.imgUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTZhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNpbiBpbWFnZW48L3RleHQ+PC9zdmc+'}" 
               alt="${item.nombre}" 
               class="card-image">
        </div>
        <div class="p-4 flex-grow">
          <h3 class="font-bold text-lg mb-1">${item.nombre}</h3>
          ${currentType === "paquetes" && item.descripcion ? `<p class="text-sm text-gray-500 mb-2">${item.descripcion}</p>` : ""}
          ${currentType === "servicios" && item.duracion_min ? `<p class="text-sm text-gray-600 mb-1">Duración: ${item.duracion_min} min</p>` : ""}
          ${currentType === "productos" && item.stock !== undefined ? `<p class="text-sm text-gray-600 mb-1">Stock: ${item.stock}</p>` : ""}
          <p class="text-green-600 font-bold text-lg mt-2">$${item.precio}</p>
        </div>
        <div class="p-4 border-t border-gray-100">
          <div class="flex gap-2">
            <button onclick="editRegistro('${currentType}', ${itemId})" class="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Editar
            </button>
            <button onclick="deleteRegistro('${currentType}', ${itemId})" class="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      `;
    }).join("");
  }

  // Abrir modal
  function openModal(data = null) {
    modal.classList.remove("hidden");
    document.body.style.overflow = 'hidden';
    
    // Obtener el id correcto según el tipo
    if (data) {
      editingId = getIdFromItem(data, currentType);
    } else {
      editingId = null;
    }
    
    modalTitle.textContent = data ? "Editar Registro" : "Agregar Registro";

    // Mostrar/ocultar campos según el tipo
    const descripcionField = formRegistro.querySelector('[name="descripcion"]');
    const duracionField = formRegistro.querySelector('[name="duracion"]');
    const stockField = formRegistro.querySelector('[name="stock"]');

    // Ocultar todos primero
    descripcionField.classList.add("hidden");
    duracionField.classList.add("hidden");
    stockField.classList.add("hidden");

    // Mostrar los campos según el tipo
    if (currentType === "paquetes") {
      descripcionField.classList.remove("hidden");
    } else if (currentType === "servicios") {
      duracionField.classList.remove("hidden");
    } else if (currentType === "productos") {
      stockField.classList.remove("hidden");
    }

    if (data) {
      formRegistro.nombre.value = data.nombre || "";
      formRegistro.descripcion.value = data.descripcion || "";
      formRegistro.duracion.value = data.duracion_min || "";
      formRegistro.stock.value = data.stock || "";
      formRegistro.precio.value = data.precio || "";
      
      // Mostrar previsualización de imagen actual si existe
      const imagePreview = document.getElementById('imagePreview');
      if (imagePreview && data.imgUrl) {
        imagePreview.innerHTML = `
          <p class="text-sm text-gray-600 mt-2">Imagen actual:</p>
          <img src="${data.imgUrl}" alt="Imagen actual" class="mt-1 max-w-full h-32 object-contain rounded">
          <p class="text-xs text-gray-500 mt-1">Selecciona una nueva imagen para cambiar</p>
        `;
      }
    } else {
      formRegistro.reset();
      const imagePreview = document.getElementById('imagePreview');
      if (imagePreview) {
        imagePreview.innerHTML = '';
      }
    }
  }

  // Manejar envío del formulario
  async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(formRegistro);
    const fileInput = formRegistro.imagen;

    try {
      let imageUrl = "";

      // Si hay un archivo, subirlo a Cloudinary
      if (fileInput.files.length > 0) {
        imageUrl = await uploadImageToCloudinary(fileInput.files[0], currentType);
      } else if (editingId) {
        // Si estamos editando y no se subió nueva imagen, mantener la existente
        const existingItem = findItemById(currentType, editingId);
        imageUrl = existingItem?.imgUrl || "";
      }

      // Construir el objeto según el tipo
      const data = {
        nombre: formData.get('nombre'),
        precio: parseFloat(formData.get('precio')),
        imgUrl: imageUrl
      };

      // Campos específicos por tipo
      if (currentType === "paquetes") {
        data.descripcion = formData.get('descripcion');
      } else if (currentType === "servicios") {
        data.duracion_min = parseInt(formData.get('duracion'));
      } else if (currentType === "productos") {
        data.stock = parseInt(formData.get('stock'));
      }

      let response;
      if (editingId) {
        // Editar
        if (currentType === "servicios") {
          response = await updateServicio(editingId, data);
        } else if (currentType === "paquetes") {
          response = await updatePaquete(editingId, data);
        } else if (currentType === "productos") {
          response = await updateProducto(editingId, data);
        }
      } else {
        // Crear
        if (currentType === "servicios") {
          response = await createServicio(data);
        } else if (currentType === "paquetes") {
          response = await createPaquete(data);
        } else if (currentType === "productos") {
          response = await createProducto(data);
        }
      }

      if (response.ok) {
        modal.classList.add("hidden");
        document.body.style.overflow = '';
        Swal.fire("Éxito", "Registro guardado correctamente", "success");
        loadData(currentType);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error al guardar registro: " + err.message, "error");
    }
  }

  // Función de búsqueda
  function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allData.filter(item => 
      item.nombre && item.nombre.toLowerCase().includes(term)
    );
    renderCards(filtered);
  }

  // Funciones globales para los botones de editar y eliminar - CORREGIDAS
  window.editRegistro = (type, id) => {
    console.log('Editando:', type, 'ID:', id);
    const data = findItemById(type, id);
    if (data) {
      openModal(data);
    } else {
      console.error('No se encontró el registro con ID:', id);
      showErrorToast('No se pudo encontrar el registro para editar');
    }
  };

  window.deleteRegistro = async (type, id) => {
    console.log('Eliminando:', type, 'ID:', id);
    
    if (!id || id === 'undefined') {
      showErrorToast('ID inválido para eliminar');
      return;
    }
    
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response;
          if (type === "servicios") {
            response = await deleteServicio(id);
          } else if (type === "paquetes") {
            response = await deletePaquete(id);
          } else if (type === "productos") {
            response = await deleteProducto(id);
          }

          if (response.ok) {
            Swal.fire("Eliminado", "El registro fue eliminado correctamente", "success");
            loadData(type);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al eliminar");
          }
        } catch (err) {
          console.error('Error al eliminar:', err);
          Swal.fire("Error", "No se pudo eliminar el registro: " + err.message, "error");
        }
      }
    });
  };
});