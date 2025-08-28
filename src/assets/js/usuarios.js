//Aquí va la URL de la API, no los endpoints específicos
const API_URL = "http://localhost:8080/api/Usuario";

export async function GetUsuarios(){
    const res = await fetch(`${API_URL}/GetUsuarios`);
    return res.json();
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



