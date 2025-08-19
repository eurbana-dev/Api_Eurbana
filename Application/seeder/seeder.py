import requests
import random
from datetime import datetime, timedelta

# Configuración
url = "http://localhost:3000/api/consumo/"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTJhYzRiN2U1ZWVlZGM5ODVkMDkxYiIsImNvcnJlbyI6Imx1aXNpdm1hcmF6MDNAZ21haWwuY29tIiwicm9sIjoiQWRtaW4iLCJpYXQiOjE3NTU1NzkwNzAsImV4cCI6MTc1NTY2NTQ3MH0.VFhqm7mnB6M88MY7UhZIukzur7kiDv6UqVUeDD_5_iI"
luminaria_id = "68a34acd5832bdcae77e998a"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Fechas de inicio y fin
start_date = datetime(2025, 8, 10, 19, 0)  # 10 ago 2025, 7 PM
end_date = datetime(2025, 8, 17, 7, 0)     # 17 ago 2025, 7 AM

current_date = start_date

while current_date <= end_date:
    # Determinar el final de la noche/madrugada
    if current_date.hour >= 19:
        day_end = current_date.replace(hour=23, minute=59)
    else:
        day_end = current_date.replace(hour=6, minute=59)

    while current_date <= day_end and current_date <= end_date:
        consumo = round(random.uniform(50, 150), 2)  # consumo en watts
        lumenes = random.randint(1000, 4000)         # lumenes
        encendida = True

        data = {
            "luminaria_id": luminaria_id,
            "timestamp": current_date.isoformat(),
            "consumo": consumo,
            "lumenes": lumenes,
            "encendida": encendida
        }

        response = requests.post(url, json=data, headers=headers)

        if response.status_code in [200, 201]:
            print(f"Registro enviado: {current_date}")
        else:
            print(f"Error {response.status_code}: {response.text}")

        # Incrementa el timestamp un minuto
        current_date += timedelta(minutes=1)

    # Salta al siguiente día a las 7 PM si terminó la madrugada
    if current_date.hour < 7:
        current_date = current_date.replace(hour=19, minute=0)

print("Seeder finalizado.")
