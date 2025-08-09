//Iconos en la slideBar
lucide.createIcons();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        window.location.replace("inicio-sesion.html");
    });
});

