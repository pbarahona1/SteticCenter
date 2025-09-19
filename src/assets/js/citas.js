// services/citas.js
const API_BASE_URL = 'http://localhost:8080';

// Obtener todas las citas
export const getCitas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiCitas/GetCitas`);
    if (!response.ok) throw new Error('Error al obtener citas');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener citas paginadas
export const getCitasPaginadas = async (page, size) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiCitas/GetCitasPaginadas?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Error al obtener citas paginadas');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Crear cita
export const createCita = async (citaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiCitas/PostCitas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citaData),
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Actualizar cita
export const updateCita = async (id, citaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiCitas/PutCitas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citaData),
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Eliminar cita
export const deleteCita = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiCitas/DeleteCitas/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener usuarios (empleados)
export const getUsuarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Usuario/GetUsers`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getHorarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ApiHorario/GetHorario`);
    if (!response.ok) throw new Error('Error al obtener horarios');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};