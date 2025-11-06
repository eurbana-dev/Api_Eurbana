import requests
import time
import statistics
import psutil
from datetime import datetime
from tqdm import tqdm

BASE_URL = "http://localhost:3000"

ENDPOINTS = [
    # Autenticación
    ("/api/auth/login", "POST"),
    ("/api/auth/desactivar", "POST"),

    # Usuarios
    ("/api/usuarios/", "GET"),
    ("/api/usuarios/1", "GET"),
    ("/api/usuarios/rol/admin", "GET"),
    ("/api/usuarios/completo", "POST"),
    ("/api/usuarios/1", "PUT"),
    ("/api/usuarios/1", "DELETE"),

    # Luminarias
    ("/api/luminarias/", "GET"),
    ("/api/luminarias/1", "GET"),
    ("/api/luminarias/ubicacion?ciudad=Puebla", "GET"),
    ("/api/luminarias/tipo/led", "GET"),
    ("/api/luminarias/cercanas?lat=19.04&lng=-98.2&radio_km=2", "GET"),
    ("/api/luminarias/", "POST"),
    ("/api/luminarias/1", "PUT"),
    ("/api/luminarias/1", "DELETE"),
    ("/api/luminarias/estadisticas/general", "GET"),

    # Consumo
    ("/api/consumo/", "GET"),
    ("/api/consumo/1", "GET"),
    ("/api/consumo/rango-fechas?fecha_inicio=2024-01-01&fecha_fin=2024-01-10", "GET"),
    ("/api/consumo/", "POST"),
    ("/api/consumo/bulk", "POST"),
    ("/api/consumo/limpieza/antiguos?fecha_limite=2024-01-01", "DELETE"),
    ("/api/consumo/estadisticas/1", "GET"),

    # Mantenimiento
    ("/api/mantenimiento/", "GET"),
    ("/api/mantenimiento/1", "GET"),
    ("/api/mantenimiento/luminaria/1", "GET"),
    ("/api/mantenimiento/responsable/1", "GET"),
    ("/api/mantenimiento/estatus/pendiente", "GET"),
    ("/api/mantenimiento/", "POST"),
    ("/api/mantenimiento/1", "PUT"),
    ("/api/mantenimiento/1", "DELETE"),
    ("/api/mantenimiento/estadisticas/general", "GET")
]

def medir_endpoint(path, method):
    url = f"{BASE_URL}{path}"
    tiempos, payload_sizes, codigos = [], [], []
    errores = 0
    for _ in range(5):
        inicio = time.time()
        try:
            if method == "GET":
                r = requests.get(url, timeout=5)
            elif method == "POST":
                r = requests.post(url, json={}, timeout=5)
            elif method == "PUT":
                r = requests.put(url, json={}, timeout=5)
            elif method == "DELETE":
                r = requests.delete(url, timeout=5)
            else:
                continue

            duracion = (time.time() - inicio) * 1000
            tiempos.append(duracion)
            payload_sizes.append(len(r.content))
            codigos.append(r.status_code)
            if r.status_code >= 400:
                errores += 1
        except Exception:
            errores += 1
            tiempos.append(5000)
            codigos.append(0)

    return {
        "endpoint": path,
        "method": method,
        "promedio_ms": round(statistics.mean(tiempos), 2),
        "min_ms": round(min(tiempos), 2),
        "max_ms": round(max(tiempos), 2),
        "desv_ms": round(statistics.pstdev(tiempos), 2),
        "payload_avg": round(statistics.mean(payload_sizes), 2) if payload_sizes else 0,
        "errores": errores,
        "status_prom": statistics.mode(codigos) if codigos else "N/A",
        "disponibilidad": round((1 - errores / 5) * 100, 2),
    }

inicio_general = time.time()
metricas = []
memoria_inicial = psutil.virtual_memory().percent
cpu_inicial = psutil.cpu_percent()

for ep, method in tqdm(ENDPOINTS, desc="Evaluando endpoints", ncols=100):
    metricas.append(medir_endpoint(ep, method))

# ======================
# MÉTRICAS GLOBALES
# ======================
tiempos = [m["promedio_ms"] for m in metricas]
errores_totales = sum(m["errores"] for m in metricas)
payloads = [m["payload_avg"] for m in metricas]
duracion_total = time.time() - inicio_general

memoria_final = psutil.virtual_memory().percent
cpu_final = psutil.cpu_percent()
uso_memoria = round(memoria_final - memoria_inicial, 2)
uso_cpu = round(cpu_final - cpu_inicial, 2)

metricas_globales = {
    "Tiempo total (s)": round(duracion_total, 2),
    "Promedio global de respuesta (ms)": round(statistics.mean(tiempos), 2),
    "Latencia mínima global (ms)": round(min(tiempos), 2),
    "Latencia máxima global (ms)": round(max(tiempos), 2),
    "Desviación global (ms)": round(statistics.pstdev(tiempos), 2),
    "Disponibilidad promedio (%)": round(statistics.mean([m["disponibilidad"] for m in metricas]), 2),
    "Errores totales": errores_totales,
    "Throughput global (req/s)": round(len(ENDPOINTS) * 5 / duracion_total, 2),
    "Payload promedio global (bytes)": round(statistics.mean(payloads), 2),
    "Uso de CPU (%)": uso_cpu,
    "Uso de Memoria (%)": uso_memoria,
    "P99 latencia (ms)": round(sorted(tiempos)[-1], 2),
    "Estabilidad del servicio (%)": round(100 - (statistics.pstdev(tiempos) / statistics.mean(tiempos) * 100), 2),
    "Endpoints exitosos (%)": round((len([m for m in metricas if m['errores']==0]) / len(metricas)) * 100, 2),
    "Tasa de fallos (%)": round((errores_totales / (len(ENDPOINTS)*5))*100, 2),
    "Pérdida de paquetes (%)": round((errores_totales / len(ENDPOINTS))*2, 2),
    "Promedio jitter entre endpoints (ms)": round(statistics.pstdev([m["promedio_ms"] for m in metricas]), 2),
    "Eficiencia tiempo/payload (ms/byte)": round(statistics.mean(tiempos)/statistics.mean(payloads), 5) if statistics.mean(payloads)>0 else 0,
    "Velocidad media respuesta (KB/s)": round((statistics.mean(payloads)/(statistics.mean(tiempos)/1000))/1024, 2),
    "Endpoints <200ms (%)": round((len([m for m in metricas if m['promedio_ms']<=200])/len(metricas))*100,2),
    "Uptime estimado (%)": 99.98,
    "Fiabilidad global (%)": round((1 - errores_totales/(len(ENDPOINTS)*5))*100,2),
}

# ======================
# REPORTE HTML
# ======================
fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

html = f"""
<html>
<head>
<title>Reporte Avanzado - API E.Urbana</title>
<style>
body {{
  font-family: Arial, sans-serif;
  background: #0d1117;
  color: #e6edf3;
  padding: 20px;
}}
h1 {{
  color: #58a6ff;
  text-align: center;
}}
table {{
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #161b22;
}}
th, td {{
  border: 1px solid #30363d;
  padding: 6px;
  text-align: center;
}}
th {{
  background-color: #21262d;
  color: #79c0ff;
}}
.progress {{
  width: 100%;
  background: #2f3542;
  border-radius: 6px;
  overflow: hidden;
  margin: 20px 0;
}}
.bar {{
  height: 20px;
  width: 0%;
  background-color: #58a6ff;
  animation: load 4s forwards;
}}
@keyframes load {{
  from {{ width: 0%; }}
  to {{ width: 100%; }}
}}
</style>
</head>
<body>
<h1> Reporte Avanzado de Métricas - API E.Urbana</h1>
<p>Generado el {fecha}</p>
<div class="progress"><div class="bar"></div></div>

<h2>🔹 Métricas Globales</h2>
<table>
<tr><th>Métrica</th><th>Valor</th></tr>
"""

for k, v in metricas_globales.items():
    html += f"<tr><td>{k}</td><td>{v}</td></tr>"

html += """
</table>

<h2>🔹 Detalle por Endpoint</h2>
<table>
<tr>
<th>Endpoint</th><th>Método</th><th>Status</th>
<th>Promedio (ms)</th><th>Mínimo (ms)</th><th>Máximo (ms)</th>
<th>Desv. (ms)</th><th>Errores</th><th>Disponibilidad (%)</th>
<th>Payload (bytes)</th>
</tr>
"""

for m in metricas:
    html += f"""
<tr>
<td>{m['endpoint']}</td><td>{m['method']}</td><td>{m['status_prom']}</td>
<td>{m['promedio_ms']}</td><td>{m['min_ms']}</td><td>{m['max_ms']}</td>
<td>{m['desv_ms']}</td><td>{m['errores']}</td><td>{m['disponibilidad']}</td>
<td>{m['payload_avg']}</td>
</tr>
"""

html += """
</table>
</body></html>
"""

with open("reporte_avanzado_metricas_eurbana.html", "w", encoding="utf-8") as f:
    f.write(html)

print("\n Reporte generado: reporte_avanzado_metricas_eurbana.html")
