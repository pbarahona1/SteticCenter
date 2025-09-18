const API_CITAS = "http://localhost:8080/ApiCitas";
const API_CLIENTES = "http://localhost:8080/api/clientes";
const API_FACTURAS = "http://localhost:8080/api";

async function httpGetJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText} (${url})`);
    }
    const data = await res.json();
    if (!data) throw new Error(`Respuesta vacía en ${url}`);
    return data;
  } catch (err) {
    console.error("Error en fetch:", err.message);
    return []; 
    }
}

export async function GetCitas() {
  const data = await httpGetJson(`${API_CITAS}/GetCitas`);
  return Array.isArray(data) ? data : [data];
}

export async function GetClientes() {
  const data = await httpGetJson(`${API_CLIENTES}/GetClientes`);
  return Array.isArray(data) ? data : [data];
}

export async function GetFacturas() {
  const data = await httpGetJson(`${API_FACTURAS}/GetFacturas`);
  return Array.isArray(data) ? data : [data];
}



export function CitasTotal(citas) {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = hoy.getMonth();
  const dd = hoy.getDate();
  return citas.filter(c => {
    const f = new Date(c.fecha_cita || c.fechaCita || c.fecha);
    return f.getFullYear() === yyyy && f.getMonth() === mm && f.getDate() === dd;
  }).length;
}

export function IngresosUltimos7Dias(facturas) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  const labels = days.map(fmt);

  const sums = days.map(d => {
    return facturas
      .filter(f => {
        const fecha = new Date(f.Fecha || f.fecha || f.fechaFactura);
        return fecha.getFullYear() === d.getFullYear() &&
               fecha.getMonth() === d.getMonth() &&
               fecha.getDate() === d.getDate() &&
               (String(f.Estado || f.estado || "").toUpperCase() !== "CANCELADA");
      })
      .reduce((acc, f) => acc + (Number(f.Total ?? f.total ?? 0)), 0);
  });

  const total = sums.reduce((a,b)=>a+b,0);
  return { labels, sums, total };
}

let incomeChartInstance = null;
export function renderIncomeChart(labels, data) {
  const ctx = document.getElementById("incomeChart");
  if (!ctx) return;
  const context = ctx.getContext("2d");
  if (incomeChartInstance) {
    incomeChartInstance.data.labels = labels;
    incomeChartInstance.data.datasets[0].data = data;
    incomeChartInstance.update();
    return;
  }
  incomeChartInstance = new Chart(context, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Ingresos (últimos 7 días)",
          data,
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

export function validarRol() {

  const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));
 
  if (!usuarioSesion) {

    window.location.href = "Inicio-Sesion.html";

    return;

  }
 
  const rol = usuarioSesion.rol;
 
  if (rol === "Administrador") {

    document.getElementById("IngresosTotal").style.display = "block";

  } else if (rol === "Empleado") {

    document.getElementById("IngresosTotal").style.display = "none";

    document.getElementById("incomeChart").style.display = "none";

  }

}

 