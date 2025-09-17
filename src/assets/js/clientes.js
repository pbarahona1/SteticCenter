// assets/js/clientes.js
const API_URLS = {
  clientes: "http://localhost:8080/api/clientes"
};

// Funciones para Clientes
export async function getClientes() {
  const res = await fetch(`${API_URLS.clientes}/GetClientes`);
  return await res.json();
}

export async function getClientesPaginados(page, size) {
  const res = await fetch(`${API_URLS.clientes}/GetClientesPaginados?page=${page}&size=${size}`);
  return await res.json();
}

export async function createCliente(data) {
  const res = await fetch(`${API_URLS.clientes}/PostClientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function updateCliente(id, data) {
  const res = await fetch(`${API_URLS.clientes}/PutClientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res;
}

export async function deleteCliente(id) {
  const res = await fetch(`${API_URLS.clientes}/DeleteClientes/${id}`, {
    method: "DELETE"
  });
  return res;
}