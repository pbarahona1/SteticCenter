const apiUrl = "http://localhost:8080/api/usuarios";

export async function iniciarSesion(usuario, contrasena) {
    const respuesta = await fetch("http://localhost:8080/api/Usuario/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena })
    });
    return await respuesta.json();
}

