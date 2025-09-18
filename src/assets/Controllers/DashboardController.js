import { renderIncomeChart, validarRol } from "../js/dashboard.js";

document.addEventListener("DOMContentLoaded", async () => {
    const clientesHoyEl = document.getElementById("ClientesHoy");
    const citasHoyEl = document.getElementById("CitasHoy");
    const ingresosTotalEl = document.getElementById("IngresosTotal");

    validarRol();

    if (!clientesHoyEl || !citasHoyEl || !ingresosTotalEl) return;

    try {
        // Fetch reales
        const [citasRes, clientesRes, facturasRes] = await Promise.all([
            fetch("http://localhost:8080/ApiCitas/GetCitas").then(r => r.json()),
            fetch("http://localhost:8080/api/clientes/GetClientes").then(r => r.json()),
            fetch("http://localhost:8080/api/GetFacturas").then(r => r.json())
        ]);

        const citas = Array.isArray(citasRes) ? citasRes : [];
        const clientes = Array.isArray(clientesRes) ? clientesRes : [];
        const facturas = Array.isArray(facturasRes) ? facturasRes : [];

        // Clientes
        clientesHoyEl.textContent = clientes.length;

        // Citas hoy (ignora zona horaria)
        const hoy = new Date();
        const citasHoyCount = citas.filter(c => {
            const fecha = new Date(c.fecha_cita);
            return fecha.getUTCFullYear() === hoy.getUTCFullYear() &&
                   fecha.getUTCMonth() === hoy.getUTCMonth() &&
                   fecha.getUTCDate() === hoy.getUTCDate();
        }).length;
        citasHoyEl.textContent = String(citasHoyCount);

        // Ingresos últimos 7 días
        const dias = [];
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(hoy.getDate() - i);
            dias.push(d);
            labels.push(d.toLocaleDateString('es-ES', { month: 'short', day: '2-digit' }));
        }

        const sums = dias.map(d => {
            return facturas
                .filter(f => {
                    const fecha = new Date(f.Fecha || f.fecha || f.fechaFactura);
                    return fecha.getUTCFullYear() === d.getUTCFullYear() &&
                           fecha.getUTCMonth() === d.getUTCMonth() &&
                           fecha.getUTCDate() === d.getUTCDate() &&
                           (String(f.estado || f.Estado || "").toUpperCase() !== "CANCELADA");
                })
                .reduce((acc, f) => acc + Number(f.total ?? f.Total ?? 0), 0);
        });

        const total = sums.reduce((a,b)=>a+b,0);
        ingresosTotalEl.textContent = `$${total.toLocaleString()}`;
        renderIncomeChart(labels, sums);

    } catch (err) {
        console.error("Error cargando dashboard:", err);
        clientesHoyEl.textContent = "0";
        citasHoyEl.textContent = "0";
        ingresosTotalEl.textContent = "$0";
    }
});
