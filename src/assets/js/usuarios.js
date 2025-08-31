//Aquí va la URL de la API, no los endpoints específicos
const API_URL = "http://localhost:8080/api/Usuario";

export async function GetUsuarios(page = 0, size = 8) {
    const res = await fetch(`${API_URL}/GetUsuarios?page=${page}&size=${size}`);
    const data = await res.json();

    // ⚡ ahora devolvemos tanto el contenido como la metadata
    return {
        usuarios: data.content || [],   // 👈 me aseguro que sea array
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        currentPage: data.number
    };
}

export async function createUsuarios(data){
    const res = await fetch(`${API_URL}/PostUsuarios`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res; // <-- Devuelve la respuesta para validarla
}

export async function updateUsuarios(id, data){
    const res = await fetch(`${API_URL}/PutUsuario/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res; // <-- Devuelve la respuesta para validarla
}
export async function deleteUsuarios(id){
    const response = await fetch(`${API_URL}/DeleteUsuario/${id}`, {
        method: "DELETE"
    });
    
    // Verificar si la respuesta fue exitosa (código 200-299)
    if (response.ok) {
        return true; // Éxito
    } else {
        return false; // Error
    }
}

export async function userOrDuiExists(usuario, dui, id = null) {
    try {
        const usuarios = await GetUsuarios();
        const existeUsuario = usuarios.find(
            u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.idUsuario != id
        );
        const existeDui = usuarios.find(
            u => u.dui === dui && u.idUsuario != id
        );

        return {
            usuario: !!existeUsuario,
            dui: !!existeDui
        };
    } catch (error) {
        console.error("Error verificando usuario/dui:", error);
        return { usuario: false, dui: false };
    }
}