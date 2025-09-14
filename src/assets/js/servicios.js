// URLs de la API
const API_URLS = {
  servicios: "http://localhost:8080/ApiServicios",
  paquetes: "http://localhost:8080/api/paquetes",
  productos: "http://localhost:8080/api/productos",
  cloudinary: "http://localhost:8080/Api/image"
};

// Funciones para Servicios
export async function getServicios() {
  const res = await fetch(`${API_URLS.servicios}/ConsultarServicios`);
  return await res.json();
}

export async function createServicio(data) {
  const res = await fetch(`${API_URLS.servicios}/IngresarServicios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function updateServicio(id, data) {
  const res = await fetch(`${API_URLS.servicios}/EditarServicios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function deleteServicio(id) {
  const res = await fetch(`${API_URLS.servicios}/EliminarServicios/${id}`, {
    method: "DELETE"
  });
  return res;
}

// Funciones para Paquetes
export async function getPaquetes() {
  const res = await fetch(`${API_URLS.paquetes}/GetPaquetes`);
  return await res.json();
}

export async function createPaquete(data) {
  const res = await fetch(`${API_URLS.paquetes}/PostPaquetes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function updatePaquete(id, data) {
  const res = await fetch(`${API_URLS.paquetes}/PutPaquetes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function deletePaquete(id) {
  const res = await fetch(`${API_URLS.paquetes}/DeletePaquetes/${id}`, {
    method: "DELETE"
  });
  return res;
}

// Funciones para Productos
export async function getProductos() {
  const res = await fetch(`${API_URLS.productos}/GetProductos`);
  return await res.json();
}

export async function createProducto(data) {
  const res = await fetch(`${API_URLS.productos}/PostProductos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function updateProducto(id, data) {
  const res = await fetch(`${API_URLS.productos}/PutProductos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function deleteProducto(id) {
  const res = await fetch(`${API_URLS.productos}/DeleteProductos/${id}`, {
    method: "DELETE"
  });
  return res;
}

// Función para subir imagen a Cloudinary
export async function uploadImageToCloudinary(file, folder) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_URLS.cloudinary}/upload-to-folder`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error('Error al subir la imagen');
  }

  const data = await res.json();
  return data.url;
}