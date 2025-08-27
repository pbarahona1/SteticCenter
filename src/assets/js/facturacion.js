//Iconos de la slideBar 
lucide.createIcons();



    // Inicializar cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        const sidebar = document.querySelector('aside');
        
        // Configurar eventos para detectar hover
        sidebar.addEventListener('mouseenter', toggleLogos);
        sidebar.addEventListener('mouseleave', toggleLogos);
        
        // Establecer estado inicial
        toggleLogos();
        
        // Inicializar iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1e40af',
                        accent: '#ef4444',
                        success: '#10b981',
                        danger: '#ef4444',
                        pink: {
                            600: '#db2777'
                        }
                    }
                }
            }
        }


 document.addEventListener('DOMContentLoaded', function() {
            // Establecer fecha actual por defecto
            const today = new Date().toISOString().split('T')[0];
            document.querySelector('input[type="date"]').value = today;
            
            // Inicializar event listeners
            initEventListeners();
            
            // Calcular valores iniciales
            calcularTotales();
        });
        
        function initEventListeners() {
            // Agregar producto
            document.getElementById('add-product').addEventListener('click', addProduct);
            
            // Guardar factura
            document.getElementById('guardar-factura').addEventListener('click', guardarFactura);
            
            // Delegación de eventos para elementos dinámicos
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-product')) {
                    removeProduct(e.target);
                }
            });
            
            document.addEventListener('change', function(e) {
                if (e.target.classList.contains('product-select')) {
                    updatePrecio(e.target);
                }
            });
            
            document.addEventListener('input', function(e) {
                if (e.target.classList.contains('cantidad-input')) {
                    updateSubtotal(e.target);
                }
            });
        }
        
        function addProduct() {
            const container = document.getElementById('productos-container');
            const newRow = document.createElement('div');
            newRow.className = 'grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end';
            newRow.innerHTML = `
                <div class="md:col-span-5">
                    <label class="block text-gray-700 font-medium mb-2">Producto *</label>
                    <select class="product-select w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required>
                        <option value="">Seleccione un producto</option>
                        <option value="1" data-precio="25.00">Consultación General</option>
                        <option value="2" data-precio="50.00">Limpieza Dental</option>
                        <option value="3" data-precio="120.00">Ortodoncia</option>
                        <option value="4" data-precio="85.00">Blanqueamiento</option>
                    </select>
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-gray-700 font-medium mb-2">Precio Unitario ($)</label>
                    <input type="number" class="precio-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" step="0.01" min="0" value="0.00" readonly>
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-gray-700 font-medium mb-2">Cantidad *</label>
                    <input type="number" class="cantidad-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" value="1" min="1" required>
                </div>
                
                <div class="md:col-span-2">
                    <label class="block text-gray-700 font-medium mb-2">Subtotal ($)</label>
                    <input type="number" class="subtotal-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" step="0.01" min="0" value="0.00" readonly>
                </div>
                
                <div class="md:col-span-1">
                    <button class="remove-product bg-danger text-white w-full h-10 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                        <i class="fas fa-trash"></i>Eliminar
                    </button>
                </div>
            `;
             container.appendChild(newRow);
    
            // Inicializar cálculos para la nueva fila
            const select = newRow.querySelector('.product-select');
            const cantidadInput = newRow.querySelector('.cantidad-input');
    
            // Agregar event listeners
            select.addEventListener('change', function() { updatePrecio(this); });
            cantidadInput.addEventListener('input', function() { updateSubtotal(this); });
    
    // INICIALIZAR LOS ICONOS DE LUCIDE PARA LA NUEVA FILA
    lucide.createIcons();
        }
        
        function removeProduct(button) {
            const row = button.closest('.grid');
            // No permitir eliminar la última fila
            if (document.querySelectorAll('#productos-container > .grid').length > 1) {
                row.remove();
                calcularTotales();
            } else {
                alert('Debe haber al menos un producto en la factura.');
            }
        }
        
        function updatePrecio(select) {
            const selectedOption = select.options[select.selectedIndex];
            const precio = selectedOption.getAttribute('data-precio') || '0.00';
            const precioInput = select.closest('.grid').querySelector('.precio-input');
            precioInput.value = parseFloat(precio).toFixed(2);
            updateSubtotal(select.closest('.grid').querySelector('.cantidad-input'));
        }
        
        function updateSubtotal(input) {
            const row = input.closest('.grid');
            const precioInput = row.querySelector('.precio-input');
            const cantidadInput = row.querySelector('.cantidad-input');
            const subtotalInput = row.querySelector('.subtotal-input');
            
            const precio = parseFloat(precioInput.value) || 0;
            const cantidad = parseInt(cantidadInput.value) || 0;
            const subtotal = precio * cantidad;
            
            subtotalInput.value = subtotal.toFixed(2);
            calcularTotales();
        }
        
        function calcularTotales() {
            let subtotal = 0;
            document.querySelectorAll('.subtotal-input').forEach(input => {
                subtotal += parseFloat(input.value) || 0;
            });
            
            const impuestos = subtotal * 0.1; // 10% de impuestos
            const total = subtotal + impuestos;
            
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('impuestos').textContent = `$${impuestos.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        }
        
        function guardarFactura() {
            // Validaciones básicas
            const cliente = document.querySelector('select').value;
            const fecha = document.querySelector('input[type="date"]').value;
            
            if (!cliente) {
                alert('Por favor, seleccione un cliente.');
                return;
            }
            
            if (!fecha) {
                alert('Por favor, ingrese la fecha de la factura.');
                return;
            }
            
            // Validar que al menos un producto tenga cantidad y precio
            let productosValidos = false;
            document.querySelectorAll('#productos-container > .grid').forEach(row => {
                const producto = row.querySelector('.product-select').value;
                const cantidad = row.querySelector('.cantidad-input').value;
                
                if (producto && cantidad > 0) {
                    productosValidos = true;
                }
            });
            
            if (!productosValidos) {
                alert('Por favor, agregue al menos un producto con cantidad válida.');
                return;
            }
            
            // Simular envío de datos
            alert('Factura guardada correctamente. En un sistema real, los datos se enviarían a la base de datos.');
        }


        document.getElementById('imprimir-pdf').addEventListener('click', imprimirPDF);

// Función para imprimir PDF
function imprimirPDF() {
    // Validar que la factura tenga datos antes de imprimir
    const cliente = document.querySelector('select').value;
    if (!cliente) {
        alert('Por favor, complete los datos de la factura antes de imprimir.');
        return;
    }

    // Crear una ventana de impresión
    const ventanaImpresion = window.open('', '_blank');
    
    // Contenido HTML para el PDF
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Factura - ${document.querySelector('select option:checked').textContent}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; }
                .info div { margin-bottom: 8px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f5f5f5; }
                .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
                .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Factura</h1>
                <p>Estético Center</p>
            </div>
            
            <div class="info">
                <div><strong>Cliente:</strong> ${document.querySelector('select option:checked').textContent}</div>
                <div><strong>Fecha:</strong> ${document.querySelector('input[type="date"]').value}</div>
                <div><strong>Estado:</strong> ${document.querySelectorAll('select')[1].value}</div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Producto/Servicio</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${generarFilasTablaPDF()}
                </tbody>
            </table>
            
            <div class="total">
                <div>Subtotal: ${document.getElementById('subtotal').textContent}</div>
                <div>Impuestos (10%): ${document.getElementById('impuestos').textContent}</div>
                <div>Total: ${document.getElementById('total').textContent}</div>
            </div>
            
            <div class="footer">
                <p>Gracias por su preferencia</p>
                <p>Factura generada el: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Imprimir
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                    Cerrar
                </button>
            </div>
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
}

// Función auxiliar para generar las filas de la tabla del PDF
function generarFilasTablaPDF() {
    let filas = '';
    document.querySelectorAll('#productos-container > .grid').forEach(row => {
        const producto = row.querySelector('.product-select option:checked').textContent;
        const precio = row.querySelector('.precio-input').value;
        const cantidad = row.querySelector('.cantidad-input').value;
        const subtotal = row.querySelector('.subtotal-input').value;
        
        filas += `
            <tr>
                <td>${producto}</td>
                <td>$${precio}</td>
                <td>${cantidad}</td>
                <td>$${subtotal}</td>
            </tr>
        `;
    });
    return filas;
}
        

document.addEventListener('DOMContentLoaded', function() {
    const botonFactura = document.getElementById('Abrir-Lista');
    
    if (botonFactura) {
        botonFactura.addEventListener('click', function() {
            // Redirigir a la página de facturación
            window.location.href = 'facturas.html';
        });
    } else {
        console.error('El botón con ID "guardar-factura" no fue encontrado');
    }
});