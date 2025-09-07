import { GetCitas, GetClientes, GetFacturas, CitasTotal, IngresosUltimos7Dias, renderIncomeChart } from "../js/dashboard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const clientesEl = document.getElementById("ClientesHoy");
  const citasHoyEl = document.getElementById("CitasHoy");
  const ingresosTotalEl = document.getElementById("IngresosTotal");

  try {
    const [citas, clientes, facturas] = await Promise.all([GetCitas(), GetClientes(), GetFacturas()]);

    if (clientesEl) clientesEl.textContent = Array.isArray(clientes) ? clientes.length : 0;

    const citasCount = CitasTotal(Array.isArray(citas) ? citas : []);
    if (citasHoyEl) citasHoyEl.textContent = String(citasCount);

    const { labels, sums, total } = IngresosUltimos7Dias(Array.isArray(facturas) ? facturas : []);
    renderIncomeChart(labels, sums);
    if (ingresosTotalEl) ingresosTotalEl.textContent = `$${total.toLocaleString()}`;

  } catch (err) {
    console.error("Error cargando dashboard:", err);
    if (clientesEl && !clientesEl.textContent) clientesEl.textContent = "0";
    if (citasHoyEl && !citasHoyEl.textContent) citasHoyEl.textContent = "0";
    if (ingresosTotalEl && !ingresosTotalEl.textContent) ingresosTotalEl.textContent = "$0";
  }
});

import { validarRol } from "../js/dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
    validarRol();
});
