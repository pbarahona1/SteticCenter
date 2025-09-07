import { iniciarSesion } from "../js/inicio-sesion.js";

const formulario = document.getElementById("formularioLogin");

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    const datos = await iniciarSesion(usuario, contrasena);

    if (datos && datos.idusuario) {
        localStorage.setItem("usuarioSesion", JSON.stringify(datos));
        Toast.fire({ icon: "success", title: "Inicio de sesión exitoso" });

        if (datos.rol === "Administrador") {
            window.location.href = "dashboard.html";
        } else if (datos.rol === "Empleado") {
            window.location.href = "dashboard.html";
        }
    } else {
        Toast.fire({ icon: "error", title: "Usuario o contraseña incorrectos" });
    }
});
