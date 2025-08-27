lucide.createIcons();


    // Funcionalidad básica de filtrado (puedes expandir esto)
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                // Aquí iría la lógica de filtrado real
                console.log('Filtrando...', this.value);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                window.location.href = 'inicio-sesion.html';
            }
        });

        // Asegurarse de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const botonFactura = document.getElementById('Abrir-Crear');
    
    if (botonFactura) {
        botonFactura.addEventListener('click', function() {
            // Redirigir a la página de facturación
            window.location.href = 'facturacion.html';
        });
    } else {
        console.error('El botón con ID "guardar-factura" no fue encontrado');
    }
});