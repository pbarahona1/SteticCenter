//Iconos de la slideBar 
lucide.createIcons();

const IMG_API_URL = "https://api.imgbb.com/1/upload?key=c5d362b83a7ed1398ad88f26269340fe";
const API_URLS = {
  servicios: "https://retoolapi.dev/dmL1JF/Servicios",
  paquetes: "https://retoolapi.dev/JTKy4c/Paquetes",
  productos: "https://retoolapi.dev/R1hEpO/Productos"
};

let currentType = "servicios";
let allData = [];
let editingId = null;


const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modalForm");
const closeModal = document.getElementById("closeModal");
const formRegistro = document.getElementById("formRegistro");
const modalTitle = document.getElementById("modalTitle");
const btnAgregar = document.getElementById("btnAgregar");

// Abrir modal
btnAgregar.addEventListener("click", () => openModal());
closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// Función para actualizar botones
function updateActiveButton(activeType) {
  ['servicios', 'paquetes', 'productos'].forEach(type => {
    const btn = document.getElementById(`btn${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (btn) {
      btn.className = `px-4 py-2 rounded ${type === activeType ? 'bg-pink-600 text-white' : 'bg-gray-300'}`;
    }
  });
}


// Cargar datos
async function loadData(type) {
  currentType = type;
  updateActiveButton(type);
  cardsContainer.innerHTML = "<p class='col-span-full text-center'>Cargando...</p>";
  try {
    const res = await fetch(API_URLS[type]);
    const data = await res.json();
    allData = data;
    renderCards(data);
  } catch (error) {
    cardsContainer.innerHTML = "<p class='col-span-full text-center text-red-500'>Error al cargar datos</p>";
  }
}

// cargar tarjetas
function renderCards(data) {
  if (!data.length) {
    cardsContainer.innerHTML = "<p class='col-span-full text-center'>No hay registros</p>";
    return;
  }
  
  cardsContainer.innerHTML = data.map(item => `
    <div class="bg-white shadow rounded-lg overflow-hidden card">
      <div class="card-image-container">
        <img src="${item.imagen || 'https://via.placeholder.com/300x180?text=Sin+imagen'}" 
             alt="${item.nombre}" 
             class="card-image">
      </div>
      <div class="p-4 flex-grow">
        <h3 class="font-bold text-lg mb-1">${item.nombre}</h3>
        <p class="text-sm text-gray-500 mb-2">${item.descripcion || ''}</p>
        ${currentType === "servicios" && item.duracion ? `<p class="text-sm text-gray-600 mb-1">Duración: ${item.duracion} min</p>` : ""}
        ${currentType === "productos" && item.stock ? `<p class="text-sm text-gray-600 mb-1">Stock: ${item.stock}</p>` : ""}
        <p class="text-green-600 font-bold text-lg mt-2">$${item.precio}</p>
      </div>
      <div class="p-4 border-t border-gray-100">
        <div class="flex gap-2">
          <button onclick="editRegistro(${item.id})" class="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Editar
          </button>
          <button onclick="deleteRegistro(${item.id})" class="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Abrir modal 
function openModal(data = null) {
  modal.classList.remove("hidden");
  editingId = data ? data.id : null;
  modalTitle.textContent = data ? "Editar Registro" : "Agregar Registro";


  const descripcionField = formRegistro.querySelector('[name="descripcion"]');
  const duracionField = formRegistro.querySelector('[name="duracion"]');
  const stockField = formRegistro.querySelector('[name="stock"]');


  descripcionField.classList.toggle("hidden", currentType !== "paquetes");
  duracionField.classList.toggle("hidden", currentType !== "servicios");
  stockField.classList.toggle("hidden", currentType !== "productos");

  if (data) {
    formRegistro.nombre.value = data.nombre || "";
    formRegistro.descripcion.value = data.descripcion || "";
    formRegistro.duracion.value = data.duracion || "";
    formRegistro.stock.value = data.stock || "";
    formRegistro.precio.value = data.precio || "";
    formRegistro.imagen.value = data.imagen || "";
  } else {
    formRegistro.reset();
  }
}

// Función para subir imagen a ImgBB
async function subirImagen(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(IMG_API_URL, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
        return data.data.url;
    } else {
        Swal.fire("Error", "Error al subir la imagen", "error");
        throw new Error("Error al subir la imagen");
    }
}

// Guardar registro

formRegistro.addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(formRegistro);
  const fileInput = formRegistro.imagen;
  
  try {

    if (fileInput.files.length > 0) {
      const imageUrl = await subirImagen(fileInput.files[0]);
      formData.set('imagen', imageUrl);
    }
    

    const formDataObj = Object.fromEntries(formData.entries());
    

    if (currentType !== "servicios") delete formDataObj.duracion;
    if (currentType !== "productos") delete formDataObj.stock;
    if (currentType !== "paquetes") delete formDataObj.descripcion;
    if (formDataObj.imagen === "") delete formDataObj.imagen;

    const url = API_URLS[currentType] + (editingId ? `/${editingId}` : "");
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObj)
    });

    if (!response.ok) throw new Error("Error al guardar");

    modal.classList.add("hidden");
    Swal.fire("Éxito", "Registro guardado correctamente", "success");
    loadData(currentType);
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Error al guardar registro: " + err.message, "error");
  }
});

window.editRegistro = id => {
  const data = allData.find(item => item.id === id);
  openModal(data);
};


window.deleteRegistro = async id => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URLS[currentType]}/${id}`, { method: "DELETE" });
        loadData(currentType);
        Swal.fire("Eliminado", "El registro fue eliminado correctamente", "success");
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  });
};

// Filtro búsqueda
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = allData.filter(item => 
    item.nombre.toLowerCase().includes(term)
  );
  renderCards(filtered);
});

// Botones navegación
document.getElementById("btnServicios").addEventListener("click", () => loadData("servicios"));
document.getElementById("btnPaquetes").addEventListener("click", () => loadData("paquetes"));
document.getElementById("btnProductos").addEventListener("click", () => loadData("productos"));




updateActiveButton('servicios');
// Cargar por defecto
loadData("servicios");
